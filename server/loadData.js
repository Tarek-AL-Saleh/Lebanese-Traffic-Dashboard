const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('./db');
const turf = require('@turf/turf');
const { logActivity } = require('./logger');

// Path to CSV from project root
const csvPath = path.join(__dirname, '..', 'public', 'data', 'sample_data.csv');
const governorates = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'lebanon-governorates.geojson')));

function findGovernorate(lat, lon) {
  const pt = turf.point([lon, lat]);

  for (const feature of governorates.features) {
    if (turf.booleanPointInPolygon(pt, feature.geometry)) {
      return ""+feature.properties.name_en;
    }
  }

  return "Unspecified";
}

function importCsv() {
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    process.exit(1);
  }

  const rows = [];
  const coordinateKey = null;

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      // Find coordinate key (header contains "Coordinate")
      const coordKey = Object.keys(data).find(k => k && k.toLowerCase().includes('coordinate'));
      let lon = null, lat = null;
      if (coordKey && data[coordKey]) {
        const parts = data[coordKey].replace(/"/g, '').split(',').map(s => s.trim());
        if (parts.length >= 2) {
          lon = parseFloat(parts[0]);
          lat = parseFloat(parts[1]);
        }
      }

      // parse date/time
      const dateStr = data['Date'] || data['date'];
      const timeStr = data['Time'] || data['time'];

      // Normalize date for MySQL (YYYY-MM-DD) using Date
      let mysqlDate = null;
      try {
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d)) {
            mysqlDate = d.toISOString().slice(0,10);
          }
        }
      } catch (e) {}

      const course = parseFloat(data['Course'] || data['course']) || null;
      const velocity = parseFloat(data['Velocity'] || data['velocity']) || null;
      const osm = data['OSM ID'] || data['OSM ID'] || data['osm id'] || data['osm_id'] || null;
      const state = findGovernorate(lat, lon);
      rows.push([mysqlDate, timeStr || null, lon, lat, course, velocity, osm, state]);
    })
    .on('end', async () => {
      console.log(`Parsed ${rows.length} rows, inserting into DB...`);
      try {
        const conn = await pool.getConnection();
        try {
          await conn.beginTransaction();
          // bulk insert
          const sql = 'INSERT INTO traffic (`date`, `time`, lon, lat, course, velocity, osm_id, state) VALUES ?';
          await conn.query(sql, [rows]);
          await conn.commit();
          console.log('Import complete');
          logActivity('system', `import_csv rows=${rows.length}`);
        } catch (err) {
          await conn.rollback();
          console.error('Insert failed:', err);
        } finally {
          conn.release();
        }
      } catch (err) {
        console.error('DB connection failed:', err);
      } finally {
        process.exit(0);
      }
    });
}

importCsv();

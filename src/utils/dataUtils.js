import Papa from 'papaparse';

// Load CSV from public folder (only first 50 rows)
export async function fetchTrafficData() {
  return new Promise((resolve, reject) => {
    Papa.parse("/data/sample_data.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data.slice(0, 50)),
      error: (err) => reject(err)
    });
  });
}

// Process CSV: parse timestamp and round velocity
export function processTrafficData(data) {
  return data.map(row => ({
    ...row,
    timestamp: new Date(`${row.Date} ${row.Time}`),
    speed: Math.round(parseFloat(row.Velocity)),
    coordinates: row['Coordinate	 (Lon, Lat)'] || row['Coordinates'] || 'N/A'
  }));
}

// Filter by date range and velocity range
export function filterDataByRange(data, filters) {
  return data.filter(row => {
    let ok = true;

    // Date range filter
    if (filters.startDate && row.timestamp < new Date(filters.startDate)) ok = false;
    if (filters.endDate && row.timestamp > new Date(filters.endDate)) ok = false;

    // Velocity range filter
    if (filters.VelocityMin !== undefined && row.speed < filters.VelocityMin) ok = false;
    if (filters.VelocityMax !== undefined && row.speed > filters.VelocityMax) ok = false;

    return ok;
  });
}

// Calculate basic statistics
export function calculateStats(data, field) {
  if (!field) return {};
  const numbers = data.map(row => parseFloat(row[field])).filter(v => !isNaN(v));
  if (!numbers.length) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = numbers.reduce((a,b)=>a+b,0)/numbers.length;
  return { min, max, avg: avg.toFixed(2) };
}

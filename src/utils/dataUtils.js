// Previously the app loaded CSV client-side. For phase 2 the backend serves data.
// Fetch data from the Node.js server at /api/data
export async function fetchTrafficData() {
  const url = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/data?limit=100';
  const token = localStorage.getItem('auth_token');
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();
  // normalize to the same shape old code expected
  return data.map(r => ({
    Date: r.date ? (new Date(r.date)).toLocaleDateString() : '',
    Time: r.time || '',
    'Coordinate\t (Lon, Lat)': r.lon != null && r.lat != null ? `${r.lon},${r.lat}` : '',
    Course: r.course,
    Velocity: r.velocity,
    'OSM ID': r.osm_id,
    timestamp: r.date ? new Date(`${r.date} ${r.time}`) : null,
    speed: Math.round(r.velocity || 0)
  }));
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

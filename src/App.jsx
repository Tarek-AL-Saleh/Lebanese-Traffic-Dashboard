import { useState, useEffect } from "react";
import { fetchTrafficData, processTrafficData } from "./utils/dataUtils";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "2015-01-01",
    endDate: "2019-12-31",
    VelocityMin: 0,
    VelocityMax: 200
  });

  useEffect(() => {
    async function loadData() {
      const raw = await fetchTrafficData();
      const processed = processTrafficData(raw).slice(0, 100); // first 100 rows
      setData(processed);
      setFilteredData(processed);
    }
    loadData();
  }, []);

  const applyFilters = () => {
    const filtered = data.filter(row => {
      const rowDate = new Date(row.timestamp);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      const velocity = row.speed;

      return rowDate >= start && rowDate <= end &&
             velocity >= filters.VelocityMin &&
             velocity <= filters.VelocityMax;
    });
    setFilteredData(filtered);
  };

  // Statistics
  const numbers = filteredData.map(r => r.speed).filter(v => !isNaN(v));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = (numbers.reduce((a,b)=>a+b,0)/numbers.length || 0).toFixed(2);

  // Histogram data
  const bins = 10;
  const binSize = Math.ceil((max - min) / bins || 1);
  const counts = Array(bins).fill(0);
  numbers.forEach(v => {
    const idx = Math.min(Math.floor((v - min)/binSize), bins-1);
    counts[idx]++;
  });
  const labels = counts.map((_, i) => `${min + i*binSize}-${min + (i+1)*binSize}`);

  const highlightColor = "#6a5acd"; // bluish-purple

  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 4 }, fontFamily: "Roboto, sans-serif", backgroundColor: "#fff" }}>

      <Typography variant="h4" align="center" sx={{ mb: 3, color: highlightColor }}>
        Lebanese Traffic Dashboard
      </Typography>

      {/* Filters */}
      <Paper sx={{ mb: 4, p: { xs: 2, sm: 3 }, backgroundColor: "#f9f9f9", mx: "auto", width: "100%", maxWidth: 1000 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={filters.startDate}
              onChange={e => setFilters({...filters, startDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={filters.endDate}
              onChange={e => setFilters({...filters, endDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              label="Velocity Min"
              type="number"
              fullWidth
              value={filters.VelocityMin}
              onChange={e => setFilters({...filters, VelocityMin: Number(e.target.value)})}
              size="small"
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              label="Velocity Max"
              type="number"
              fullWidth
              value={filters.VelocityMax}
              onChange={e => setFilters({...filters, VelocityMax: Number(e.target.value)})}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: highlightColor, "&:hover": { backgroundColor: "#5b4db3" }, height: "100%" }}
              onClick={applyFilters}
            >
              Apply Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mb: 4, maxWidth: 1000, mx: "auto" }}>
        {[
          { title: "Min Velocity", value: min },
          { title: "Max Velocity", value: max },
          { title: "Average Velocity", value: avg }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Paper sx={{ p: 2, textAlign: "center", backgroundColor: "#fafafa", border: `1px solid ${highlightColor}` }}>
              <Typography variant="subtitle1" sx={{ color: highlightColor }}>{stat.title}</Typography>
              <Typography variant="h5">{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Histogram */}
      <Paper sx={{ mb: 4, p: 2, maxWidth: 1000, width: "100%", mx: "auto", backgroundColor: "#fafafa" }}>
        <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center", color: highlightColor }}>Velocity Distribution</Typography>
        <Bar
          data={{
            labels,
            datasets: [{ label: "Count", data: counts, backgroundColor: highlightColor }]
          }}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true }, x: { title: { display: true, text: "Velocity Range" } } }
          }}
        />
      </Paper>

      {/* Data Table */}
      <Paper sx={{ p: 2, maxWidth: 1000, width: "100%", mx: "auto", backgroundColor: "#fff", overflowX: "auto" }}>
        <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center", color: highlightColor }}>First 50 Traffic Records</Typography>
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", color: "#000" }}>
            <thead style={{ backgroundColor: highlightColor, color: "#fff" }}>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Coordinates</th>
                <th>Course</th>
                <th>Velocity</th>
                <th>OSM ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{row.Date}</td>
                  <td>{row.Time}</td>
                  <td>{row['Coordinate\t (Lon, Lat)']}</td>
                  <td>{row.Course}</td>
                  <td style={{ fontWeight: "bold" }}>{row.speed}</td>
                  <td>{row["OSM ID"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
}

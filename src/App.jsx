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
      const processed = processTrafficData(raw).slice(0, 100);
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

  // Stats
  const numbers = filteredData.map(r => r.speed).filter(v => !isNaN(v));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const avg = (numbers.reduce((a,b)=>a+b,0)/numbers.length || 0).toFixed(2);

  // Histogram
  const bins = 10;
  const binSize = Math.ceil((max - min) / bins || 1);
  const counts = Array(bins).fill(0);
  numbers.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
    counts[idx]++;
  });
  const labels = counts.map((_, i) => `${min + i * binSize}-${min + (i + 1) * binSize}`);

  const highlightColor = "#6a5acd";

  return (
    <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#fff",
        overflowX: "hidden"
      }}
    >
      {/* Center Column Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {/* Title */}
        <Typography 
          align="center"
          sx={{ 
            mb: 3, 
            color: highlightColor,
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" }
          }}
        >
          Lebanese Traffic Dashboard
        </Typography>

        {/* Filters */}
        <Paper
          sx={{
            mb: 4,
            p: { xs: 2, sm: 3 },
            backgroundColor: "#f9f9f9",
            width: "90%",
            overflow: "hidden"
          }}
        >
          <Grid 
            container 
            spacing={2}
            sx={{ width: "100%", margin: 0 }}      // ✅ prevents overflow
          >
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={6} md={2}>
              <TextField
                label="Velocity Min"
                type="number"
                fullWidth
                value={filters.VelocityMin}
                onChange={e => setFilters({ ...filters, VelocityMin: Number(e.target.value) })}
                size="small"
              />
            </Grid>

            <Grid item xs={6} sm={6} md={2}>
              <TextField
                label="Velocity Max"
                type="number"
                fullWidth
                value={filters.VelocityMax}
                onChange={e => setFilters({ ...filters, VelocityMax: Number(e.target.value) })}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: highlightColor,
                  "&:hover": { backgroundColor: "#5b4db3" },
                  height: "100%"
                }}
                onClick={applyFilters}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Paper>


        {/* Statistics */}
        <Grid 
          container 
          spacing={2} 
          justifyContent="center"            // ✅ centers the grid items
          sx={{ mb: 4, width: "100%", margin: 0 }}
        >
          {[
            { title: "Min Velocity", value: min },
            { title: "Max Velocity", value: max },
            { title: "Average Velocity", value: avg }
          ].map((stat, idx) => (
            <Grid 
              item 
              xs={12} sm={6} md={4}           // ✅ responsive and centered
              key={idx}
              display="flex"
              justifyContent="center"
            >
              <Paper 
                sx={{ 
                  p: 2, 
                  width: "100%",
                  maxWidth: 250,              // ✅ prevents stretching and misalignment
                  textAlign: "center", 
                  border: `1px solid ${highlightColor}`
                }}
              >
                <Typography 
                  sx={{ 
                    color: highlightColor,
                    fontSize: { xs: "0.9rem", sm: "1rem" }
                  }}
                >
                  {stat.title}
                </Typography>

                <Typography 
                  sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem" } }}
                >
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>


        {/* Histogram */}
        <Paper sx={{ mb: 4,mt: 4, p: 2, width: "90%", overflow: "hidden" }}>
          <Typography 
            sx={{ 
              mb: 2, 
              textAlign: "center", 
              color: highlightColor,
              fontSize: { xs: "1rem", sm: "1.2rem" }
            }}
          >
            Velocity Distribution
          </Typography>

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Box sx={{ height: 300 }}>
              <Bar
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Count",
                      data: counts,
                      backgroundColor: highlightColor
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true },
                    x: { title: { display: true, text: "Velocity Range" } }
                  }
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Data Table */}
        <Paper sx={{ p: 2, width: "90%", overflow: "hidden" }}>
          <Typography 
            sx={{ 
              mb: 2, 
              textAlign: "center", 
              color: highlightColor,
              fontSize: { xs: "1rem", sm: "1.2rem" }
            }}
          >
            First 50 Traffic Records
          </Typography>

          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                fontSize: "clamp(0.7rem, 1vw, 1rem)"
              }}
            >
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
                    <td>{row["Coordinate\t (Lon, Lat)"]}</td>
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
    </Box>
  );
}

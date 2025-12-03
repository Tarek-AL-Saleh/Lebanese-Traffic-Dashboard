import { useState, useEffect } from "react";
import { fetchTrafficData, processTrafficData } from "./utils/dataUtils";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";
import Login from './components/Login';
import GovernorateStatistics from './components/GovernorateStatistics';
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
import DataTable from "./components/DataTable"
import Filters from "./components/Filters"
import Histogram from "./components/Histogram"
import Statistics from "./components/Statistics"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [auth, setAuth] = useState(() => ({ token: localStorage.getItem('auth_token') || null, username: localStorage.getItem('auth_username') || null }));
  const [filters, setFilters] = useState({
    startDate: "2015-01-01",
    endDate: "2019-12-31",
    VelocityMin: 0,
    VelocityMax: 200,
    governorate: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const raw = await fetchTrafficData();
        const processed = processTrafficData(raw);
        setData(processed);
        setFilteredData(processed);
      } catch (err) {
        console.error('Failed to load data', err);
        setData([]);
        setFilteredData([]);
      }
    }
    // Only load data when there's a token
    if (auth.token) loadData();
  }, [auth.token]);

  const applyFilters = () => {
    const filtered = data.filter((row) => {
      const rowDate = new Date(row.timestamp);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      const velocity = row.speed;
      const governorate = row.state;

      return (
        rowDate >= start &&
        rowDate <= end &&
        velocity >= filters.VelocityMin &&
        velocity <= filters.VelocityMax &&
        (!filters.governorate || governorate === filters.governorate)
      );
    });
    setFilteredData(filtered);
  };

  // Stats
  const numbers = filteredData.map(r => r.speed).filter(v => !isNaN(v));
  const min = numbers.length ? Math.min(...numbers) : 0;
  const max = numbers.length ? Math.max(...numbers) : 0;
  const avg = numbers.length ? (numbers.reduce((a,b)=>a+b,0)/numbers.length).toFixed(2) : '0.00';

  // Histogram
  const bins = 10;
  const range = Math.max(1, max - min);
  const binSize = Math.ceil(range / bins) || 1;
  const counts = Array(bins).fill(0);
  numbers.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
    if (idx >= 0 && idx < bins) counts[idx]++;
  });
  const labels = counts.map((_, i) => `${min + i * binSize}-${min + (i + 1) * binSize}`);

  const highlightColor = "#6a5acd";

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#fff",
        overflowX: "hidden"
      }}
    >
      {!auth.token && (
        <Box sx={{ width: '100%', maxWidth: 900, px: 2, py: 4 }}>
          <Login onLogin={({ username, token }) => {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_username', username);
            setAuth({ token, username });
          }} />
        </Box>
      )}
      {auth.token && (
        <>
          <Box sx={{ width: '100%', maxWidth: 300, px: 2, py: 2, display: 'flex', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Typography>Signed in as <strong>{auth.username || localStorage.getItem('auth_username')}</strong></Typography>
              <Button variant="outlined" size="small" onClick={() => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_username');
                setAuth({ token: null, username: null });
              }}>Logout</Button>
            </Box>
          </Box>

          <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
        <Filters applyFilters={applyFilters} filters={filters} setFilters={setFilters} data={data}/>
        {/* Statistics */}
        <Statistics min={min} max={max} avg={avg}/>
        {/* Governorate Statistics */}
        <GovernorateStatistics filteredData={filteredData} />
        {/* Histogram */}
        <Histogram filteredData={filteredData} />
        {/* Data Table */}
        <DataTable filteredData={filteredData} />
      </Box>
      <Box 
        sx={{
          width: "100%",
          py: 2,
          mt: 4,
          textAlign: "center",
          borderTop: "1px solid #ddd",
          color: "#666",
          fontSize: "0.9rem"
        }}
      >
        © {new Date().getFullYear()} Lebanese Traffic Dashboard — All rights reserved.
      </Box>
      </>
      )}
    </Box>
  );
}

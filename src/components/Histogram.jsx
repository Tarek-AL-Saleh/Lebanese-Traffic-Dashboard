import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Paper, Box, Typography } from "@mui/material";

export default function Histogram({ filteredData }) {
  const highlightColor = "#6a5acd";

  // Stats
  const numbers = filteredData.map((r) => r.speed).filter((v) => !isNaN(v));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  // Histogram
  const bins = 10;
  const binSize = Math.ceil((max - min) / bins || 1);
  const counts = Array(bins).fill(0);
  numbers.forEach((v) => {
    const idx = Math.min(Math.floor((v - min) / binSize), bins - 1);
    counts[idx]++;
  });
  const labels = counts.map(
    (_, i) => `${min + i * binSize}-${min + (i + 1) * binSize}`
  );

  return (
    <Paper sx={{ margin:"auto",mb: 4, mt: 4, p: 2, width: "90%", overflow: "hidden" }}>
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
                  backgroundColor: highlightColor,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true },
                x: { title: { display: true, text: "Velocity Range" } },
              },
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

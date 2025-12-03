import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function DataTable({ filteredData }) {
  const highlightColor = "#6a5acd";

  return (
    <Paper sx={{ margin:"auto",p: 2, width: "90%", overflow: "hidden" }}>
      <Typography
        sx={{
          mb: 2,
          textAlign: "center",
          color: highlightColor,
          fontSize: { xs: "1rem", sm: "1.2rem" }
        }}
      >
        First 100 Traffic Records
      </Typography>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            fontSize: "clamp(0.7rem, 1.3vw, 1.4rem)"
          }}
        >
          <thead style={{ backgroundColor: highlightColor, color: "#fff" }}>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Governorate</th>
              <th>Coordinates</th>
              <th>Course</th>
              <th>Velocity</th>
              <th>OSM ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0,100).map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{row.Date}</td>
                <td>{row.Time}</td>
                <td>{row.state}</td>
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
  );
}

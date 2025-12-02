import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { calculateGovernorateStats } from "../utils/dataUtils";

export default function GovernorateStatistics({ filteredData }) {
  const highlightColor = "#6a5acd";
  const governorateStats = calculateGovernorateStats(filteredData);

  return (
    <Paper sx={{ margin: "auto", p: 2, width: "90%", overflow: "hidden", mb: 4 }}>
      <Typography
        sx={{
          mb: 2,
          textAlign: "center",
          color: highlightColor,
          fontSize: { xs: "1rem", sm: "1.2rem" },
          fontWeight: "bold"
        }}
      >
        Governorates Ranked by Average Velocity
      </Typography>

      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <TableContainer>
          <Table
            sx={{
              textAlign: "center",
              fontSize: "clamp(0.7rem, 1.3vw, 1.4rem)"
            }}
          >
            <TableHead style={{ backgroundColor: highlightColor, color: "#fff" }}>
              <TableRow>
                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Rank</TableCell>
                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Governorate</TableCell>
                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Avg Velocity (Km/h)</TableCell>
                <TableCell align="center" sx={{ color: "#fff", fontWeight: "bold" }}>Records</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {governorateStats.length > 0 ? (
                governorateStats.map((stat, idx) => (
                  <TableRow
                    key={stat.governorate}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                      borderBottom: "1px solid #ddd"
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {idx + 1}
                    </TableCell>
                    <TableCell align="center">
                      {stat.governorate}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: highlightColor }}>
                      {stat.avgVelocity}
                    </TableCell>
                    <TableCell align="center">
                      {stat.count}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 2, color: "#999" }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}

import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, Grid } from "@mui/material";

export default function Filters({ applyFilters, filters, setFilters }) {
  return (
    <>
      <Typography
        align="center"
        sx={{
          mb: 3,
          color: "#6a5acd",
          fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" }
        }}
      >
        Lebanese Traffic Dashboard
      </Typography>

      <Paper
        sx={{
          margin:"auto",
          mb: 4,
          p: { xs: 2, sm: 3 },
          backgroundColor: "#f9f9f9",
          width: "80%",
          overflow: "hidden"
        }}
      >
        <Grid container spacing={3} justifyContent="center" sx={{ width: "100%", margin: 0 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
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
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
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
              onChange={(e) =>
                setFilters({ ...filters, VelocityMin: Number(e.target.value) })
              }
              size="small"
            />
          </Grid>

          <Grid item xs={6} sm={6} md={2}>
            <TextField
              label="Velocity Max"
              type="number"
              fullWidth
              value={filters.VelocityMax}
              onChange={(e) =>
                setFilters({ ...filters, VelocityMax: Number(e.target.value) })
              }
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#6a5acd",
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
    </>
  );
}

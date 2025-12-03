import { Box, Grid, Paper, Typography } from "@mui/material";

export default function Statistics({ min, max, avg }) {
  const highlightColor = "#6a5acd";

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{ mb: 4, width: "100%", margin: 0 }}
    >
      {[
        { title: "Min Velocity (Km/h)", value: min },
        { title: "Max Velocity (Km/h)", value: max },
        { title: "Avg Velocity (Km/h)", value: avg },
      ].map((stat, idx) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={idx}
          display="flex"
          justifyContent="center"
        >
          <Paper
            sx={{
              p: 2,
              width: "100%",
              maxWidth: 250,
              textAlign: "center",
              border: `1px solid ${highlightColor}`,
            }}
          >
            <Typography
              sx={{
                color: highlightColor,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {stat.title}
            </Typography>

            <Typography sx={{ fontSize: { xs: "1.3rem", sm: "1.6rem" } }}>
              {stat.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

import React from "react";
import { Box, Card } from "@mui/material";
import { Chip, Typography } from "@mui/joy";
const CrimeInfoWindow = ({ card }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 250 }}>
      <Box sx={{ my: 1, mx: 2 }}>
        <Chip sx={{ mb: 0.5 }} variant="outlined">
          Crime Info
        </Chip>
        <Typography
          variant="h6"
          sx={{ fontSize: "md", fontWeight: "lg", color: "black" }}
          noWrap
        >
          {card.content.type}
        </Typography>
        <Typography
          variant="body1"
           sx={{ fontSize: "sm", fontWeight: "sm" }}
        >
          {card.content.address} at {card.content.date}
        </Typography>
      </Box>
    </Card>
  );
};
export default CrimeInfoWindow;

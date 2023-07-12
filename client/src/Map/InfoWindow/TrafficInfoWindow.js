import React from "react";
import { Box, Card } from "@mui/material";
import { Chip, Typography } from "@mui/joy";
const TrafficInfoWindow = ({ card }) => {
  const types = [
    "",
    "Accident",
    "Congestion",
    "Disabled Vehicle",
    "Mass Transit",
    "Miscellaneous",
    "Other News",
    "Planned Event",
    "Road Hazard",
    "Construction",
    "Alert",
    "Weather",
  ];
  return (
    <Card sx={{ width: "100%", maxWidth: 250 }}>
      <Box sx={{ my: 1, mx: 2 }}>
        <Chip sx={{ mb: 0.5 }} variant="outlined">
          Traffic Type
        </Chip>
        <Typography
          variant="h6"
          sx={{ fontSize: "md", fontWeight: "lg", color: "black" }}
          noWrap
        >
          {types[card.type]}
        </Typography>
        <Typography
          variant="body1"
           sx={{ fontSize: "sm", fontWeight: "sm" }}
        >
          {card.content}
        </Typography>
      </Box>
    </Card>
  );
};
export default TrafficInfoWindow;

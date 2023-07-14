import React from "react";
import {
  Box,
  ListItemDecorator,
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
} from "@mui/joy";
import { LocationOn } from "@mui/icons-material";

const AlertItem = ({ alert }) => {
  // Destructure field address inside alert, rename it to location
  const { address: location, duration, radius } = alert;
  console.log("AlertItem component called");
  console.log("AlertItem is", alert);
  // console.log(location);

  return (
    <Box>
      <Card
        variant="outlined"
        orientation="horizontal"
        sx={{
          width: 400,
          "&:hover": {
            boxShadow: "md",
            borderColor: "neutral.outlinedHoverBorder",
          },
        }}
      >
        <CardContent>
          <Typography level="h2" fontSize="lg" id="card-description" mb={0.5} sx={{py:1}}>
            <ListItemDecorator>
              <LocationOn />
            </ListItemDecorator>{" "}
            {location}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              in {radius} kms
            </Chip>
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              for {duration} days
            </Chip>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AlertItem;

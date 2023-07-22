import React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import PlaceIcon from '@mui/icons-material/Place';
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";

// Icons import
import DirectionsIcon from "@mui/icons-material/Directions";
// custom
import theme from "../shared/theme";

export default function RouteResult({ route, routeInfo }) {
  return (
    <CssVarsProvider defaultMode="light" theme={theme}>
      <CssBaseline />
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "md",
          p: 2,
          listStyle: "none",
          mt: 1.5,
          maxWidth: "350px",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <DirectionsIcon />
          <Typography sx={{ fontWeight: "bold", mt: 0, fontSize: "14px" }}>
            Route Summary
          </Typography>
        </Box>
        <Divider component="div" sx={{ my: 1.5 }} />
        <List sx={{ "--ListItemDecorator-size": "48px", flexWrap: "wrap", mx:-1.5  }}>
          <ListItem sx={{ alignItems: "flex-start", width: "100%" }}>
            <ListItemDecorator
              sx={{
                "&:before": {
                  content: '""',
                  position: "absolute",
                  height: "100%",
                  width: "2px",
                  bgcolor: "divider",
                  left: "calc(var(--ListItem-paddingLeft) + 15px)",
                  top: "50%",
                },
              }}
            >
              <Avatar size="sm" ><PlaceIcon /></Avatar>
            </ListItemDecorator>
            <ListItemContent>
              <Typography fontSize="sm">
                {route.legs[0].start_address}
              </Typography>
              <Typography level="body3">Departure</Typography>
            </ListItemContent>
          </ListItem>
          {route.legs &&
            route.legs.map((destination, index) => {
              if (index !== route.legs.length - 1)
                return (
                  <ListItem sx={{ alignItems: "flex-start" }}>
                    <ListItemDecorator
                      sx={{
                        "&:before": {
                          content: '""',
                          position: "absolute",
                          height: "100%",
                          width: "2px",
                          bgcolor: "divider",
                          left: "calc(var(--ListItem-paddingLeft) + 15px)",
                          top: "50%",
                        },
                      }}
                    >
                      <Avatar size="sm" ><PlaceIcon /></Avatar>
                    </ListItemDecorator>
                    <ListItemContent>
                      <Typography fontSize="sm">
                        {destination.end_address}
                      </Typography>
                      <Typography level="body3">
                        Distance: {destination.distance.text} - Duration:{" "}
                        {destination.duration.text}
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                );
              else return (
                <ListItem sx={{ alignItems: "flex-start" }}>
                  <ListItemDecorator>
                    <Avatar size="sm" ><PlaceIcon /></Avatar>
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography fontSize="sm">
                      {destination.end_address}
                    </Typography>
                    <Typography level="body3">
                      Distance: {destination.distance.text} - Duration:{" "}
                      {destination.duration.text}
                    </Typography>
                  </ListItemContent>
                </ListItem>)
            })}
        </List>
        <Divider component="div" sx={{ my: 2 }} />
        <Typography fontSize="sm">Safety tags:</Typography>
        <Box sx={{ mt: 1.5, display: "flex", gap: 1 , flexWrap: "wrap"}}>
          <Chip
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ borderRadius: "sm" }}
          >
            Average Safety Score: {routeInfo.averageSafetyScore}
          </Chip>
          <Chip
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ borderRadius: "sm" }}
          >
            {routeInfo.trafficCount} Traffic Markers
          </Chip>
          <Chip
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ borderRadius: "sm" }}
          >
            {routeInfo.crimeCount} Crime Markers
          </Chip>
        </Box>
      </Sheet>
    </CssVarsProvider>
  );
}

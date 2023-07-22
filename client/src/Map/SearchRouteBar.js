import { useState, useEffect } from "react";
import { Typography, Stack, Avatar, Button } from "@mui/joy";
import { Stepper, Step, StepLabel, Paper } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { styled } from "@mui/material/styles";
import SearchRoute from "./SearchRoute";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import RouteResult from "./RouteResult";
export default function SearchRouteBar({
  setRoutes,
  setTravelMode,
  route,
  handleShowSearchRouteBar,
}) {
  const [address, setAddress] = useState({});
  const [inputs, setInputs] = useState([
    { id: 1, placeholder: "Search an origin to your route", value: null },
  ]);
  const [currentTravelMode, setCurrentTravelMode] = useState("DRIVING");

  const handleSetRoutes = () => {
    // Find origin and destination
    const origin = inputs[0].value.geometry.location;
    const furthestDestination = { input: null, distance: 0 };
    inputs.forEach((input) => {
      const destination = input.value.geometry.location;
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          origin,
          destination
        );
      if (distance > furthestDestination.distance) {
        furthestDestination.input = input;
        furthestDestination.distance = distance;
      }
    });
    const destination = furthestDestination.input;
    // Handle duplicates and set origin at index 0 and destination at the final index
    const uniqueInputs = [];
    uniqueInputs.push(inputs[0]);
    const destinationIndex = inputs.findIndex(
      (input) => input.id === destination.id
    );
    inputs.forEach((input, index) => {
      if (index !== 0 && index !== destinationIndex) {
        const isDuplicate = uniqueInputs.some(
          (item) =>
            item.value.formatted_address === input.value.formatted_address
        );
        if (!isDuplicate) {
          uniqueInputs.push(input);
        }
      }
    });
    uniqueInputs.push(destination);
    setTravelMode(currentTravelMode);
    setRoutes(uniqueInputs);
  };

  useEffect(() => {
    if (address && address.id && address.address) {
      setInputs((prevInputs) =>
        prevInputs.map((input) =>
          input.id === address.id ? { ...input, value: address.address } : input
        )
      );
    }
  }, [address]);

  const handleAddDestination = () => {
    const newInputId = inputs.length + 1;
    const newInput = {
      id: newInputId,
      placeholder: "Search a destination",
      value: null,
    };
    setInputs([...inputs, newInput]);
  };

  const handleDelete = (id) => {
    setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
  };

  const QontoStepIconRoot = styled("div")(() => ({
    display: "flex",
    width: 22,
    alignItems: "center",
    "& .QontoStepIcon-completedIcon": {
      color: "red",
      fontSize: 18,
      transform: "translateX(-25%)",
    },
    "& .QontoStepIcon-circle": {
      color: "gray",
      fontSize: 8,
    },
  }));

  function QontoStepIcon(props) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {!completed ? (
          <PlaceOutlinedIcon className="QontoStepIcon-completedIcon" />
        ) : (
          <CircleIcon className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        width: 375,
        backgroundColor: "white",
        pl: 2,
        pt: 2,
        pb: 2,
        pr: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 1.5, gap: 2 }}
      >
        <Avatar size="sm" variant="plain">
          <Button
            variant={currentTravelMode === "DRIVING" ? "soft" : "plain"}
            color="neutral"
            onClick={() => setCurrentTravelMode("DRIVING")}
          >
            <DriveEtaIcon />
          </Button>
        </Avatar>
        <Avatar size="sm" variant="plain">
          <Button
            variant={currentTravelMode === "WALKING" ? "soft" : "plain"}
            color="neutral"
            onClick={() => setCurrentTravelMode("WALKING")}
          >
            <DirectionsWalkIcon />
          </Button>
        </Avatar>
        <Avatar size="sm" variant="plain">
          <Button
            variant="plain"
            color="neutral"
            onClick={handleShowSearchRouteBar}
          >
            <CloseIcon />
          </Button>
        </Avatar>
      </Stack>
      <Stepper activeStep={inputs.length - 1} orientation="vertical">
        {inputs.map((input) => (
          <Step key={input.id}>
            <Stack direction="row" alignItems="center" sx={{ ml: 1, mb: -1 }}>
              <StepLabel
                StepIconComponent={QontoStepIcon}
                sx={{ width: 25 }}
              ></StepLabel>
              <SearchRoute
                id={input.id}
                input={input}
                setAddress={setAddress}
              />
              <HighlightOffOutlinedIcon
                onClick={() => handleDelete(input.id)}
                sx={{
                  ml: 1,
                  color: "gray",
                }}
              />
            </Stack>
          </Step>
        ))}
      </Stepper>

      <Stack
        direction="row"
        alignItems="center"
        sx={{ ml: "auto", mt: 1, ":hover": { cursor: "pointer" } }}
        onClick={handleAddDestination}
      >
        <AddLocationAltOutlinedIcon
          onClick={handleAddDestination}
          sx={{ mt: 1.5 }}
        />
        <Typography
          level="body1"
          sx={{
            ml: 2.6,
            mt: 2,
            color: "gray",
            fontWeight: "semibold",
            fontSize: "sm",
            ":hover": { color: "black" },
          }}
        >
          Add a destination
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        sx={{ ml: "auto", mt: 1, ":hover": { cursor: "pointer" } }}
        onClick={handleSetRoutes}
      >
        <SearchIcon onClick={handleSetRoutes} />
        <Typography
          level="body1"
          sx={{
            ml: 2.6,
            mt: 1,
            mb: 1,
            color: "gray",
            fontWeight: "semibold",
            fontSize: "sm",
            ":hover": { color: "black" },
          }}
        >
          Find an optimal path
        </Typography>
      </Stack>
      {route && <RouteResult route={route} />}
    </Paper>
  );
}

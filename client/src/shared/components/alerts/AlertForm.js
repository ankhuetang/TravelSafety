import React, { useContext, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import AlertContext from "../../../context/alert/AlertContext";
import {
  Box,
  Button,
  FormControl,
  Input,
  Typography,
  FormLabel,
} from "@mui/joy";
import { form } from "../styles";

const AlertForm = () => {
  const alertContext = useContext(AlertContext);
  const { addAlert } = alertContext;
  const [autocompleteObject, setAutocompleteObject] = useState(null);
  const [alert, setAlert] = useState({
    // autocompleteObject: null, // This might be causing a problem
    location: "",
    duration: "",
    radius: "",
    coordinate: null,
  });
  const { location, duration, radius, coordinate } = alert;

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("onSumbit called");
    console.log(alert);
    addAlert(alert);
    setAlert({
      // autocompleteObject: null, // Don't set it to null
      ...alert,
      location: "",
      duration: "",
      radius: "",
      coordinate: null,
    });
  };

  const onLoad = (autocomplete) => {
    // Initialize Autocomplete
    setAutocompleteObject(autocomplete);
    // console.log(alert);
  };

  const onChange = (event) => {
    console.log("setting alert");
    setAlert({
      ...alert,
      [event.target.name]: event.target.value,
    });
    // console.log("alert is now:", alert);
  };

  const onPlaceChanged = (e) => {
    console.log("onPlaceChanged called");
    if (autocompleteObject !== null) {
      const place = autocompleteObject.getPlace();
      console.log("autocompleteObject is:", place);
      const coordinateObject = place.geometry.location;
      const formattedAddress = place.formatted_address;
      setAlert({
        ...alert,
        location: formattedAddress,
        coordinate: coordinateObject,
      });
      console.log("alert is:", alert);
    } else {
      console.log("Autocomplete is still loading or invalid");
    }
  };

  const formIsValid = location !== null && duration !== "" && radius !== "";

  return (
    <Box component="main" sx={form}>
      <div>
        <Typography component="h1" fontSize="xl2" fontWeight="lg">
          Add Alert
        </Typography>
        <Typography level="body2" sx={{ my: 1, mb: 3 }}>
          Specify a location to receive daily alerts via message
        </Typography>
      </div>
      <form onSubmit={onSubmit}>
        <FormControl required>
          <FormLabel> Location</FormLabel>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Input placeholder="Enter location" />
          </Autocomplete>
        </FormControl>
        <FormControl required>
          <FormLabel>Duration (in days)</FormLabel>
          <Input
            type="number"
            min={1}
            name="duration"
            value={duration}
            onChange={onChange}
          />
        </FormControl>
        <FormControl required>
          <FormLabel>Radius (in miles)</FormLabel>
          <Input
            type="number"
            min={1}
            name="radius"
            value={radius}
            onChange={onChange}
          />
        </FormControl>
        {formIsValid ? (
          <Button type="submit" fullWidth>
            Subscribe
          </Button>
        ) : (
          <fieldset disabled>
            <Button type="submit" fullWidth disabled>
              Subscribe
            </Button>
          </fieldset>
        )}
      </form>
    </Box>
  );
};

export default AlertForm;

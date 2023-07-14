import React, { useContext, useState } from "react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
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
  });
  const { location, duration, radius } = alert;
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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
    });
  };

  const onLoad = (autocomplete) => {
    // setAlert({ ...alert, autocompleteObject: autocomplete });
    setAutocompleteObject(autocomplete);
    // console.log(alert);
  };

  const onChange = (event) => {
    setAlert({
      ...alert,
      [event.target.name]: event.target.value,
    });
  };

  // Code copied from ChatGPT lol --> Solves the problem
  const onPlaceChanged = (e) => {
    if (autocompleteObject !== null) {
      const place = autocompleteObject.getPlace();
      const formattedAddress = place.formatted_address;
      setAlert({ ...alert, location: formattedAddress });
    } else {
      console.log("Autocomplete is still loading or invalid");
    }
  };

  // const onPlaceChanged = (e) => {
  //   if (autocompleteObject !== null) {
  //     // location is an Object with function getPlace() will return an OBJECT, which CANNOT be rendered as a React child
  //     const place = autocompleteObject.getPlace();
  //     console.log(place);
  //     const formattedAddress = place.formatted_address; // get the string value of the location
  //     console.log("The formatted address is: ", formattedAddress);
  //     setAlert({ ...alert, location: formattedAddress });
  //   } else {
  //     console.log("Autocomplete is not loaded yet");
  //   }
  // };

  const formIsValid = location !== null && duration !== "" && radius !== "";

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
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
              <Button type="submit" fullWidth>
                Subscribe
              </Button>
            </fieldset>
          )}
        </form>
      </Box>
    </LoadScript>
  );
};

export default AlertForm;

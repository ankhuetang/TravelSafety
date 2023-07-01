// TODO: Clear location input after submitting

import React, { useCallback, useContext, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "./AlertForm.css";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import AlertContext from "../../../context/alert/AlertContext";

const AlertForm = () => {
  const alertContext = useContext(AlertContext);
  const { addAlert } = alertContext;
  const [alert, setAlert] = useState({
    autocompleteObject: null,
    location: "",
    duration: "",
    radius: "",
  });
  const { autocompleteObject, location, duration, radius } = alert;
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
    setAlert({ ...alert, autocompleteObject: autocomplete });
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
      <div>
        <Container className="d-flex justify-content-center">
          <Form.Text className="description">
            <h2>Add Alert</h2>
          </Form.Text>
        </Container>
        <Container className="d-flex justify-content-center">
          <Form.Text className="description">
            Specify a location to receive daily alerts via message
          </Form.Text>
        </Container>
        <Container className="d-flex justify-content-center">
          <div className="alert-form">
            <Form onSubmit={onSubmit}>
              <Form.Group controlId="location">
                <Form.Label>
                  Location
                  <span className="red-asterisk">*</span>
                </Form.Label>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <input type="text" placeholder="Enter location" />
                </Autocomplete>
              </Form.Group>
              <Form.Group controlId="duration">
                <Form.Label>
                  Duration (in days)
                  <span className="red-asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  name="duration"
                  value={duration}
                  onChange={onChange}
                />
              </Form.Group>
              <Form.Group controlId="radius">
                <Form.Label>
                  Radius (in miles)
                  <span className="red-asterisk">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  name="radius"
                  value={radius}
                  onChange={onChange}
                />
              </Form.Group>
              <Container className="d-flex justify-content-center">
                {formIsValid ? (
                  <Button
                    className="submit-button"
                    variant="primary"
                    type="submit"
                  >
                    Subscribe
                  </Button>
                ) : (
                  <fieldset disabled>
                    <Button
                      className="submit-button"
                      variant="secondary"
                      type="submit"
                    >
                      Subscribe
                    </Button>
                  </fieldset>
                )}
              </Container>
            </Form>
          </div>
        </Container>
      </div>
    </LoadScript>
  );
};

export default AlertForm;

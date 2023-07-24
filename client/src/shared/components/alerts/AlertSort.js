import React, { useContext, useState } from "react";
import AlertContext from "../../../context/alert/AlertContext";
import { Box, Select, Option } from "@mui/joy";
import { sort } from "../styles";

const AlertSort = () => {
  const alertContext = useContext(AlertContext);
  const { alerts, filtered, sortAlerts } = alertContext;

  const getLocation = () => {
    console.log("getLocation function called");
    // IMPORTANT PART: Convert getCurrentPosition into a function that returns a Promise
    return new Promise((resolve, reject) => {
      const successCallback = (position) => {
        console.log("getCurrentPosition success");
        const { coords } = position;
        const { latitude, longitude } = coords;
        resolve({ lat: latitude, lng: longitude });
      };

      const errorCallback = (error) => {
        console.log("getCurrentPosition is raising error:", error);
        reject(null);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    });
  };

  const sortList = async (option) => {
    console.log("sorting by", option);
    // Function to sort the list based on the selected option
    if (option === "createdAt") {
      const sorted = (filtered !== null ? filtered : alerts)
        .slice()
        .sort((a, b) => a.createdAt - b.createdAt);
      sortAlerts(sorted);
    }
    if (option === "coordinate") {
      const userCoordinate = await getLocation(); // use await here since getLocation is now an async function
      console.log("user coordinate is:", userCoordinate);
      const sorted = (filtered !== null ? filtered : alerts)
        .slice()
        .sort(
          (a, b) =>
            window.google.maps.geometry.spherical.computeDistanceBetween(
              userCoordinate,
              a.coordinate
            ) -
            window.google.maps.geometry.spherical.computeDistanceBetween(
              userCoordinate,
              b.coordinate
            )
        );
      sortAlerts(sorted);
    }
  };

  return (
    // <Box sx={sort}>
    <Select placeholder="Sort By" color="neutral">
      <Option value="createdAt" onClick={() => sortList("createdAt")}>
        Create Date
      </Option>
      <Option value="coordinate" onClick={() => sortList("coordinate")}>
        Distance from User
      </Option>
    </Select>
    // </Box>
    // <Box component="main" sx={form}>
    //   <button onClick={() => sortList("createdAt")}>Sort by Create Date</button>
    //   <button onClick={() => sortList("coordinate")}>
    //     Sort by distance to user
    //   </button>
    // </Box>
  );
};

export default AlertSort;

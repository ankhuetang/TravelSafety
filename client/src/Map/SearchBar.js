import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from "react";
import { makeRequestData } from "./utils.js";
import { Paper, InputBase, Divider, IconButton } from "@mui/material";

import DirectionsIcon from "@mui/icons-material/Directions";
const SearchBar = ({ setRequestData, setViewport, setSearched, handleShowSearchRouteBar }) => {
  const searchInput = useRef();
  console.log("helluuu searchInput is ", searchInput);
  const handlePlacesChanged = () => {
    const place = searchInput.current.getPlaces();
    //must use try catch block
    try {
      const center = place[0].geometry.location.toJSON();
      const bounds = place[0].geometry.viewport.toJSON();
      console.log("place is ", place);
      const addressData = makeRequestData(center, bounds);
      setRequestData(addressData);
      const viewport = new window.google.maps.LatLngBounds();
      viewport.extend(center);
      setViewport(viewport);
      setSearched(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <StandaloneSearchBox
      onLoad={(ref) => (searchInput.current = ref)}
      onPlacesChanged={handlePlacesChanged}
    >
      <Paper
        elevation={6}
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search Google Maps"
          inputProps={{ "aria-label": "search google maps" }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        {/* change the theme here */}
        <IconButton color="#458586" sx={{ p: "10px" }} aria-label="directions" onClick={handleShowSearchRouteBar}>
          <DirectionsIcon />
        </IconButton>
      </Paper>
    </StandaloneSearchBox>
  );
};

export default SearchBar;

import "./SearchBar.css";
import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from "react";
import { makeRequestData } from "./utils.js";
const SearchBar = ({ setRequestData, setViewport, setSearched }) => {
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
      <input
        type="text"
        placeholder="Search an address"
        className="combobox-input"
      />
    </StandaloneSearchBox>
  );
};

export default SearchBar;

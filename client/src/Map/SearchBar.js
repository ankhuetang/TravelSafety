import "./SearchBar.css";
import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from "react";
import { makeRequestData } from "./utils.js";
const SearchBar = ({ setRequestData, setViewport, setSearched }) => {
  const searchInput = useRef();
  const handlePlacesChanged = () => {
    const place = searchInput.current.getPlaces();
    const center = place[0].geometry.location.toJSON();
    const bounds = place[0].geometry.viewport.toJSON();
    const addressData = makeRequestData(center, bounds);
    setRequestData(addressData);
    const viewport = new window.google.maps.LatLngBounds();
    viewport.extend(center)
    setViewport(viewport)
    setSearched(true)
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

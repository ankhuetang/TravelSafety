import "./SearchBar.css";
import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from "react";

const SearchBar = ({ setRequestData }) => {
  const searchInput = useRef();
  const handlePlacesChanged = () => {
    const place = searchInput.current.getPlaces();
    const addressData = {
      address: place[0].formatted_address,
      coordinates: {
        lat: place[0].geometry.location.lat(),
        lng: place[0].geometry.location.lng(),
      },
      radius: 5,
    };
    setRequestData(addressData);
  }
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

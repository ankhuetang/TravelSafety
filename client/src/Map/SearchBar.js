import "./SearchBar.css";
import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from "react";
import axios from 'axios';

const SearchBar = ({ setLocation }) => {
  const searchInput = useRef();
  const fetchData = async (request) => {
    try {
      const response = await axios.post('/api/map/data', request);
      setLocation(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  const handleLocation = () => {
    const place = searchInput.current.getPlaces();
    if (place) {
      console.log("place: ", place[0]);
      const address = place[0].formatted_address
      const lat = place[0].geometry.location.lat();
      const lng = place[0].geometry.location.lng();
      console.log(lat, lng)
      const request = {
        address: address,
        coordinates: {
          lat: lat,
          lng: lng
        }, 
        radius: 5
      }
      fetchData(request);
    }
  };
  return (
    <StandaloneSearchBox
      onLoad={(ref) => (searchInput.current = ref)}
      onPlacesChanged={handleLocation}
    >
      <input
        type="text"
        placeholder="Search an adress"
        className="combobox-input"
      />
    </StandaloneSearchBox>
  );
};

export default SearchBar;

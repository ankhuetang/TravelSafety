import { StandaloneSearchBox } from "@react-google-maps/api";
import React, { useRef } from "react";
import { Input } from "@mui/joy";

const SearchRoute = ({ id, input, setAddress }) => {
  const searchInput = useRef();
  const handlePlacesChanged = () => {
    try {
      const place = searchInput.current.getPlaces();
      setAddress({ id: id, address: place[0] });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <StandaloneSearchBox
      onLoad={(ref) => (searchInput.current = ref)}
      onPlacesChanged={handlePlacesChanged}
    >
      <Input sx={{ flex: 1, width: "280px", fontSize: "sm" }} placeholder={input.placeholder} />
    </StandaloneSearchBox>
  );
};

export default SearchRoute;

import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import SearchBar from "./SearchBar.js";
import "./Map.css";
import InfoWindowContent from "./InfoWindowContent.js";
import ColorBar from "./data/ColorBar.js";
import axios from "axios";
import { makeMarkers, makeRequestData } from "./utils.js";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;
const US_BOUNDS = {
  north: 49.3457868,
  west: -124.7844079,
  east: -66.9513812,
  south: 24.7433195,
};
const temp_center = {
  lat: 33.56,
  lng: -117.72,
};
const options = {
  minZoom: 9,
  restriction: {
    latLngBounds: {
      north: 49.3457868,
      west: -124.7844079,
      east: -66.9513812,
      south: 24.7433195,
    },
    strictBounds: true,
  },
  mapId: MAP_ID,
};
const libraries = ["places", "core", "geometry", "geocoding"];

function MapContainer() {
  const [map, setMap] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [panned, setPanned] = useState(false);
  const [viewport, setViewport] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log("navigator working", latitude, longitude);
      if (
        US_BOUNDS.north >= latitude >= US_BOUNDS.south &&
        US_BOUNDS.west <= longitude <= US_BOUNDS.east
      )
        map.setCenter({ lat: latitude, lng: longitude });
      else alert("Your current location is not in the US");
    });
  });
  useEffect(() => {
    console.log("trigger useEffect", requestData);
    const fetchData = async (data) => {
      try {
        // delete this later
        map.fitBounds(viewport);
        console.log(data);
        const response = await axios.post(
          "http://localhost:8000/api/map/data",
          data
        );
        if (response.data) {
          const { markers } = await makeMarkers(response.data);
          map.fitBounds(viewport);
          setPanned(true);
          markers.forEach((marker) =>
            setMarkers((prevMarkers) => [...prevMarkers, marker])
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    requestData.map((data) => fetchData(data));
  }, [requestData]);

  const handleDragOrZoom = () => {
    if (panned) {
      setPanned(false);
    } else if (map) {
      const center = map.getCenter().toJSON();
      const bounds = map.getBounds().toJSON();
      const addressData = makeRequestData(center, bounds);
      setRequestData(addressData);
    }
  };
  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <ColorBar />
      <div className="map-container">
        <div className="search-bar-container">
          <SearchBar
            setRequestData={setRequestData}
            setViewport={setViewport}
          />
        </div>
        <div className="map">
          <GoogleMap
            mapContainerClassName="map-inner"
            center={temp_center}
            zoom={10}
            options={options}
            onLoad={onLoad}
            onDragEnd={handleDragOrZoom}
            onIdle={handleDragOrZoom}
          >
            {requestData &&
              requestData.map((data) => <Marker position={data.coordinates} />)}
            {markers &&
              markers.map((marker) => (
                <Marker
                  position={marker.position}
                  icon={marker.icon}
                  onClick={() => setSelectedMarker(marker)}
                />
              ))}
            {selectedMarker && (
              <InfoWindow position={selectedMarker.position}>
                <InfoWindowContent content={selectedMarker.content} />
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}

export default MapContainer;

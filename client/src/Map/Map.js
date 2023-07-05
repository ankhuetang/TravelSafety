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
import { makeMarkers } from "./utils.js";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;

// make it into user's location
const center = {
  lat: 33.56,
  lng: -117.72,
};

function MapContainer() {
  const [map, setMap] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  });

  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/map/data",
          requestData
        );
        if (response.data) {
          const { markers, bounds } = await makeMarkers(response.data);
          map.fitBounds(bounds);
          markers.forEach((marker) =>
            setMarkers((prevMarkers) => [...prevMarkers, marker])
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchSafetyData();
  }, [requestData]);
  
  const handleDrag = () => {
    const center = map.getCenter();
    const bounds = map.getBounds();
    console.log("Center:", center);
    console.log("Bounds:", bounds);
    // handle how many API calls
    // setRequestData(addressData)
  };

  const handleAPICallsForViewport = (center, bounds) => {
    // calculate API calls
    // construct RequestData
    // setRequestData
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places", "core"]}>
      <ColorBar />
      <div className="map-container">
        <div className="search-bar-container">
          <SearchBar setRequestData={setRequestData} />
        </div>
        <div className="map">
          <GoogleMap
            mapContainerClassName="map-inner"
            center={center}
            zoom={10}
            options={{ mapId: MAP_ID }}
            onLoad={onLoad}
            onDragEnd={handleDrag}
          >
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

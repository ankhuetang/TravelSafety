import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import SearchBar from "./SearchBar.js";
import "./Map.css";
import colors from "./data/ColorRange.js";
import {
  faBuildingCircleXmark,
  faBuildingCircleExclamation,
  faBuildingCircleCheck,
  faTrafficCone,
} from "@fortawesome/free-solid-svg-icons";
import InfoWindowContent from "./InfoWindowContent.js";
import ColorBar from "./data/ColorBar.js";
import axios from "axios";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;

// make it into user's location
const center = {
  lat: 33.56,
  lng: -117.72,
};

function MapContainer() {
  const [libraries] = useState(["places"]);
  const [map, setMap] = useState(null);
  const [requestData, setRequestData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  });

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/map/data",
        requestData
      );
      console.log("setting response data");
      setResponseData(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (requestData) {
      console.log(requestData);
      fetchData();
      console.log("fetching data");
    }
  }, [requestData]);

  useEffect(() => {
    // Safety scores
    if (responseData) {
      Object.entries(responseData.safetyScore).map((safetyData) => {
        console.log("displaying a safety marker", safetyData);
        let icon;
        const level = safetyData[1].safetyScore.overall;
        console.log("the overall safety is", level);
        if (level < 40) {
          icon = faBuildingCircleXmark.icon[4];
        } else if (level < 60) {
          icon = faBuildingCircleExclamation.icon[4];
        } else {
          icon = faBuildingCircleCheck.icon[4];
        }
        const newMarker = {
          position: {
            lat: safetyData[1].location.coordinates[1],
            lng: safetyData[1].location.coordinates[0],
          },
          icon: {
            path: icon,
            fillColor: colors.normalColors[level],
            fillOpacity: 1,
            strokeWeight: 1.25,
            strokeColor: "black",
            scale: 0.05,
          },
          content: safetyData[1].safetyScore,
          name: safetyData[1].name,
        };
        console.log("the new marker is done", newMarker);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      });
      // Traffic, please do this later
      setResponseData(null);
      console.log("the markers", markers);
      map.panTo(responseData.place[0].location);
    }
  }, [responseData]);

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
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
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

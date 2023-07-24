import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import SearchBar from "./SearchBar.js";
import "./Map.css";
import SafetyInfoWindow from "./InfoWindow/SafetyInfoWindow.js";
import TrafficInfoWindow from "./InfoWindow/TrafficInfoWindow.js";
import ColorBar from "./colors/ColorBar.js";
import axios from "axios";
import { makeMarkers, makeRequestData } from "./utils.js";
import MapConfigs from "./MapConfigs.js";

const { API_KEY, US_BOUNDS, temp_center, options, libraries } = MapConfigs();

function MapContainer() {
  const [map, setMap] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searched, setSearched] = useState(false);
  const [viewport, setViewport] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      if (
        US_BOUNDS.north >= latitude &&
        latitude >= US_BOUNDS.south &&
        US_BOUNDS.west <= longitude &&
        longitude <= US_BOUNDS.east
      ) {
        map.setCenter({ lat: latitude, lng: longitude });
      } else {
        alert("Your current location is not in the US");
      }
    });
  });
  useEffect(() => {
    // console.log("trigger useEffect", requestData);
    const fetchData = async (data) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/map/data",
          data
        );
        console.log("response data", response.data);
        if (response.data) {
          const { markers } = await makeMarkers(response.data);
          if (searched) map.fitBounds(viewport);
          markers.forEach((marker) =>
            setMarkers((prevMarkers) => [...prevMarkers, marker])
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (map) setCurrentLocation(map.getCenter().toJSON());

    requestData.map((data, index) => {
      setTimeout(() => fetchData(data), 500 * index);
    });
  }, [requestData]);

  const handleDragOrZoom = () => {
    if (searched) {
      setSearched(false);
    } else if (map) {
      const center = map.getCenter().toJSON();
      const bounds = map.getBounds().toJSON();
      const addressData = makeRequestData(center, bounds);
      setRequestData(addressData);
    }
  };
  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries} version="beta">
      <div className="map-container">
        <div className="search-bar-container">
          <SearchBar
            setRequestData={setRequestData}
            setViewport={setViewport}
            setSearched={setSearched}
          />
        </div>
        <div className="map">
          <GoogleMap
            mapContainerClassName="map-inner"
            center={temp_center}
            zoom={13}
            options={options}
            onLoad={onLoad}
            onDragEnd={handleDragOrZoom}
            onIdle={handleDragOrZoom}
          >
            {currentLocation && <Marker position={currentLocation} />}
            {markers &&
              markers.map((marker) => (
                <Marker
                  position={marker.position}
                  icon={marker.icon}
                  onClick={() => setSelectedMarker(marker)}
                  options={{
                    collisionBehavior:
                      window.google.maps.CollisionBehavior
                        .OPTIONAL_AND_HIDES_LOWER_PRIORITY,
                    animation: window.google.maps.Animation.DROP,
                  }}
                />
              ))}
            {selectedMarker && (
              <InfoWindow position={selectedMarker.position}>
                {selectedMarker.type === "safety" ? (
                  <SafetyInfoWindow card={selectedMarker} />
                ) : (
                  <TrafficInfoWindow card={selectedMarker} />
                )}
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}

export default MapContainer;

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import axios from "axios";
import {
  makeMarkers,
  makeRequestData,
  checkPathThroughMarkers,
} from "./utils.js";
import MapConfigs from "./MapConfigs.js";
import SearchRouteBar from "./SearchRouteBar.js";

const { API_KEY, US_BOUNDS, temp_center, options, libraries } = MapConfigs();

function MapContainer() {
  const [map, setMap] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searched, setSearched] = useState(false);
  const [viewport, setViewport] = useState(null);
  const [showSearchRouteBar, setShowSearchRouteBar] = useState(false);
  const [routes, setRoutes] = useState(null);
  const [directionsAPI, setDirectionsAPI] = useState({});
  const [travelMode, setTravelMode] = useState("");
  const [routeResponse, setRouteResponse] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const prevMarkersRef = useRef([]);
  const prevRouteResponseRef = useRef(null);
  const [loadedMarkers, setLoadedMarkers] = useState([]);
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
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
    });
    setDirectionsAPI({
      directionsService: directionsService,
      directionsRenderer: directionsRenderer,
    });
  });

  const onLoadMarker = useCallback((marker) => {
    //   loadedMarkers.forEach((marker) => {
    //     if (!markers.includes(marker.position.toString())) {
    //       setMarkers((prevMarkers) => [...prevMarkers, marker]);
    //     }
    //   setLoadedMarkers((prevMarkers) => [...prevMarkers, marker])
    //  console.log(loadedMarkers)
  });
  useEffect(() => {
    if (map && routes) {
      let waypoints = [];
      for (let i = 1; i < routes.length - 1; i++) {
        waypoints.push({
          location: routes[i].value.geometry.location,
          stopover: true,
        });
      }
      console.log("travelmode", travelMode);
      const request = {
        origin: routes[0].value.geometry.location,
        destination: routes[routes.length - 1].value.geometry.location,
        travelMode: travelMode,
        optimizeWaypoints: true,
        waypoints: waypoints,
      };
      directionsAPI.directionsService.route(
        request,
        function (response, status) {
          if (status === "OK") {
            console.log("abcxyz ", response.routes[0]);
            directionsAPI.directionsRenderer.setDirections(response);
            setRouteResponse(response.routes[0]);
          }
        }
      );
    }
  }, [routes]);

  useEffect(() => {
    const prevMarkers = prevMarkersRef.current;
    const prevRouteResponse = prevRouteResponseRef.current;
    if (markers !== prevMarkers || routeResponse !== prevRouteResponse) {
      const { averageSafetyScore, trafficCount, crimeCount } =
        checkPathThroughMarkers(routeResponse, markers);
      setRouteInfo({
        averageSafetyScore: averageSafetyScore,
        trafficCount: trafficCount,
        crimeCount: crimeCount,
      });
    }
    prevMarkersRef.current = markers;
    prevRouteResponseRef.current = routeResponse;
  }, [markers, routeResponse]);

  useEffect(() => {
    console.log("trigger useEffect", requestData);
    if (searched) map.fitBounds(viewport);
    const fetchData = async (data) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/map/data",
          data
        );
        console.log("response data", response.data);
        if (response.data) {
          console.log(response.data);
          const { newMarkers } = await makeMarkers(response.data);
          newMarkers.forEach((marker) => {
            if (
              !markers.some(
                (m) => m.position.toString() === marker.position.toString()
              )
            ) {
              setMarkers((prevMarkers) => [...prevMarkers, marker]);
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    requestData.map((data) => setTimeout(() => fetchData(data), 200));
    if (map) setCurrentLocation(map.getCenter().toJSON());
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
  const handleShowSearchRouteBar = () => {
    setShowSearchRouteBar(!showSearchRouteBar);
  };
  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries} version="beta">
      <div className="map-container">
        {showSearchRouteBar === false ? (
          <div className="search-bar-container">
            <SearchBar
              setRequestData={setRequestData}
              setViewport={setViewport}
              setSearched={setSearched}
              handleShowSearchRouteBar={handleShowSearchRouteBar}
            />
          </div>
        ) : (
          <div className="search-route-bar-container">
            <SearchRouteBar
              setRoutes={setRoutes}
              setTravelMode={setTravelMode}
              route={routeResponse}
              routeInfo={routeInfo}
              handleShowSearchRouteBar={handleShowSearchRouteBar}
            />
          </div>
        )}
        <div className="map">
          <GoogleMap
            mapContainerClassName="map-inner"
            center={temp_center}
            zoom={12}
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
                  onLoad={onLoadMarker}
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

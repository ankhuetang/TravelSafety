import colors from "./data/ColorRange.js";
import { WhereToVote, FmdBad, WrongLocation } from "@mui/icons-material";
import { renderToString } from "react-dom/server";
import { faCarOn } from "@fortawesome/free-solid-svg-icons";
export function makeMarkers(responseData) {
  const markers = [];
  const viewport = new window.google.maps.LatLngBounds()
  // Safety
  Object.entries(responseData.safetyScore).map((safetyData) => {
    let icon;
    const level = safetyData[1].safetyScore.overall;
    if (level < 40) {
      icon = <WhereToVote />;
    } else if (level < 60) {
      icon = <FmdBad />;
    } else {
      icon = <WrongLocation />;
    }
    const position = {
      lat: safetyData[1].location.coordinates[1],
      lng: safetyData[1].location.coordinates[0],
    };
    const iconString = renderToString(icon);
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(iconString, "image/svg+xml");
    const iconPath = svgDoc.querySelector("path")?.getAttribute("d");
    const newMarker = {
      type: "safety",
      position: position,
      icon: {
        path: iconPath,
        fillColor: colors.normalColors[level],
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: colors.darkerColors[level],
        scale: 1.5,
      },
      content: safetyData[1].safetyScore,
      name: safetyData[1].name,
    };
    markers.push(newMarker);
    viewport.extend(position)
  });
  // Traffic
  Object.entries(responseData.traffic).map((trafficData) => {
    const weight = trafficData[1].type;
    const position = {
      lat: trafficData[1].location.coordinates[1],
      lng: trafficData[1].location.coordinates[0],
    };
    const newMarker = {
      type: "traffic",
      position: position,
      icon: {
        path: faCarOn.icon[4],
        fillColor: "#ffcc00",
        fillOpacity: 1,
        strokeWeight: 1.25,
        strokeColor: "black",
        scale: 0.075,
      },
      content: trafficData[1].description,
      name: "",
    };
    markers.push(newMarker);
    viewport.extend(position)
  });
  return { markers, viewport };
}

// radius =  { center, horizontal, vertical, diagonal }
function calculateRadius(origin, bounds) {
  const width =
    window.google.maps.geometry.spherical.computeDistanceBetween(origin, {
      lat: origin.lat,
      lng: bounds.west,
    }) / 1000;
  const height =
    window.google.maps.geometry.spherical.computeDistanceBetween(origin, {
      lat: bounds.north,
      lng: origin.lng,
    }) / 1000;
  console.log("calculate radius", width, height);
  let center, horizontal, vertical, diagonal;
  if (width <= 20 && height <= 20) center = Math.max(width, height);
  else {
    center = 20;
    if (width - 20 > 1) horizontal = (width - 20) / 2;
    if (height - 20 > 1) vertical = (height - 20) / 2;
    if (width - 20 > 1 && height - 20 > 1)
      diagonal = Math.sqrt(width * width + height * height) / 2;
  }
  return { center, horizontal, vertical, diagonal };
}

function findCoordinates(radius, origin) {
  const { center, horizontal, vertical, diagonal } = radius;
  const areas = [];
  const calculateCoordinates = (distance, degrees) => {
    return window.google.maps.geometry.spherical
      .computeOffset(origin, distance, degrees)
      .toJSON();
  };
  if (center) areas.push({ coordinates: origin, radius: center });
  if (horizontal) {
    const west = calculateCoordinates((center + horizontal) * 1000, 270);
    const east = calculateCoordinates((center + horizontal) * 1000, 90);
    areas.push({ coordinates: west, radius: horizontal });
    areas.push({ coordinates: east, radius: horizontal });
  }
  if (vertical) {
    const north = calculateCoordinates((center + vertical) * 1000, 0);
    const south = calculateCoordinates((center + horizontal) * 1000, 180);
    areas.push({ coordinates: north, radius: vertical });
    areas.push({ coordinates: south, radius: vertical });
  }
  if (diagonal) {
    const ne = calculateCoordinates(diagonal * 1000, 45);
    const se = calculateCoordinates(diagonal * 1000, 90 + 45);
    const sw = calculateCoordinates(diagonal * 1000, 180 + 45);
    const nw = calculateCoordinates(diagonal * 1000, 270 + 45);
    [ne, se, sw, nw].forEach((coordinates) =>
      areas.push({ coordinates: coordinates, radius: diagonal })
    );
  }
  console.log("find areas", areas);
  return areas;
}
export function makeRequestData(center, bounds) {
  const radius = calculateRadius(center, bounds);
  const areas = findCoordinates(radius, center);
  const requestData = [];
  const geocoder = new window.google.maps.Geocoder();
  areas.forEach((area) => {
    let address = "";
    geocoder.geocode({ location: area.coordinates }, (results, status) => {
      try {
        address = results[0].formatted_address;
      } catch (error) {
        console.log(error.message);
      }
    });
    const data = {
      address: address,
      coordinates: area.coordinates,
      radius: area.radius,
    };
    requestData.push(data);
  });
  return requestData;
}

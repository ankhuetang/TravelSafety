import colors from "./colors/ColorRange.js";
import { WhereToVote, FmdBad } from "@mui/icons-material";
import { renderToString } from "react-dom/server";
import { faCarOn } from "@fortawesome/free-solid-svg-icons";
import { mdiMapMarkerRemoveVariant, mdiRobber } from "@mdi/js";
export function makeMarkers(responseData) {
  const newMarkers = [];
  const viewport = new window.google.maps.LatLngBounds();
  // Safety
  Object.entries(responseData.safetyScore).map((safetyData) => {
    let icon, iconPath;
    const level = safetyData[1].safetyScore.overall;
    if (level < 40) {
      iconPath = mdiMapMarkerRemoveVariant;
    } else {
      if (level < 60) icon = <FmdBad />;
      else icon = <WhereToVote />;
      const iconString = renderToString(icon);
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(iconString, "image/svg+xml");
      iconPath = svgDoc.querySelector("path")?.getAttribute("d");
    }
    const position = {
      lat: safetyData[1].location.coordinates[1],
      lng: safetyData[1].location.coordinates[0],
    };
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
    newMarkers.push(newMarker);
    viewport.extend(position);
  });
  // Traffic
  Object.entries(responseData.traffic).map((trafficData) => {
    const position = {
      lat: trafficData[1].location.coordinates[1],
      lng: trafficData[1].location.coordinates[0],
    };
    const newMarker = {
      type: trafficData[1].type,
      position: position,
      // icon: {
      //   path: faCarOn.icon[4],
      //   fillColor: "#ffcc00",
      //   fillOpacity: 1,
      //   strokeWeight: 1.25,
      //   strokeColor: "black",
      //   scale: 0.075,
      // },
      icon: {
        url: "/traffic-cone.png", // Specify the URL of the image here
        scaledSize: new window.google.maps.Size(30, 30), // Set the size of the image
      },
      content: trafficData[1].description,
    };
    newMarkers.push(newMarker);
    viewport.extend(position);
  });
  // Crime
  Object.entries(responseData.Crime).map((crimeData) => {
    const position = {
      lat: crimeData[1].location.coordinates[1],
      lng: crimeData[1].location.coordinates[0],
    };
    const newMarker = {
      type: "crime",
      position: position,
      icon: {
        path: mdiRobber,
        fillColor: "black",
        fillOpacity: 1,
        strokeWeight: 0,
        strokeColor: "black",
        scale: 1.5,
      },
      content: {
        type: crimeData[1].type,
        address: crimeData[1].address,
        date: crimeData[1].date,
      },
    };
    newMarkers.push(newMarker);
    viewport.extend(position);
  });
  return { newMarkers, viewport };
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
  // console.log("calculate radius", width, height);
  let center, horizontal, vertical, diagonal;
  const val = 20;
  if (width <= val && height <= val) center = Math.max(width, height);
  else {
    center = val;
    if (width - val > 1) horizontal = (width - val) / 2;
    if (height - val > 1) vertical = (height - val) / 2;
    if (width - val > 1 && height - val > 1)
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
  // console.log("find areas", areas);
  return areas;
}
export function makeRequestData(center, bounds) {
  const radius = calculateRadius(center, bounds);
  const areas = findCoordinates(radius, center);
  const requestData = [];
  // const geocoder = new window.google.maps.Geocoder();
  areas.forEach((area) => {
    let address = "";
    // geocoder.geocode({ location: area.coordinates }, (results, status) => {
    //   try {
    //     address = results[0].formatted_address;
    //   } catch (error) {
    //     console.log(error.message);
    //   }
    // });
    const data = {
      address: address,
      coordinates: area.coordinates,
      radius: area.radius,
    };
    requestData.push(data);
  });
  return requestData;
}

const areCoordinatesEqual = (coord1, coord2, tolerance = 0.001) => {
  console.log(coord1, coord2)
  return (
    Math.abs(coord1.lat - coord2.lat) <= tolerance &&
    Math.abs(coord1.lng - coord2.lng) <= tolerance
  );
};

export const checkPathThroughMarkers = (routeResponse, markers) => {
  const markersAlongPath = [];
  let safetyScore = 0;
  let safetyCount = 0;
  let trafficCount = 0;
  let crimeCount = 0;
  let averageSafetyScore = "No Info";
  if (routeResponse && routeResponse.overview_path && markers) {
    const path = routeResponse.overview_path;
    path.forEach((coord) => {
      markers.forEach((marker) => {
        console.log("check the second latlng")
        if (areCoordinatesEqual(coord.toJSON(), marker.position))  markersAlongPath.push(marker);
      });
    });
    markersAlongPath.forEach((marker) => {
      if (marker.type === "safety") {
        safetyScore += marker.content.overall;
        safetyCount += 1;
      } else if (marker.type === "crime") crimeCount += 1;
      else trafficCount += 1;
    });
    if (safetyCount > 0) averageSafetyScore = safetyScore / safetyCount;
  }
  console.log("checkpoint 2",averageSafetyScore, trafficCount, crimeCount )
  return { averageSafetyScore, trafficCount, crimeCount };
};

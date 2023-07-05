import colors from "./data/ColorRange.js";
import {
  faBuildingCircleXmark,
  faBuildingCircleExclamation,
  faBuildingCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export function makeMarkers(responseData) {
  const markers = []
  const bounds = new window.google.maps.LatLngBounds();
  Object.entries(responseData.safetyScore).map((safetyData) => {
    let icon;
    const level = safetyData[1].safetyScore.overall;
    if (level < 40) {
      icon = faBuildingCircleXmark.icon[4];
    } else if (level < 60) {
      icon = faBuildingCircleExclamation.icon[4];
    } else {
      icon = faBuildingCircleCheck.icon[4];
    }
    const position = {
      lat: safetyData[1].location.coordinates[1],
      lng: safetyData[1].location.coordinates[0],
    };
    const newMarker = {
      type: "safety",
      position: position,
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
    bounds.extend(position);
    markers.push(newMarker);
  });
  // Traffic
  Object.entries(responseData.traffic).map((trafficData) => {
    const icon = faTriangleExclamation.icon[4];
    const level = trafficData[1].type;
    const position = {
      lat: trafficData[1].location.coordinates[1],
      lng: trafficData[1].location.coordinates[0],
    };
    const newMarker = {
      type: "traffic",
      position: position,
      icon: {
        path: icon,
        fillColor: "red",
        fillOpacity: 1,
        strokeWeight: 1.25,
        strokeColor: "black",
        scale: 0.05,
      },
      content: trafficData[1].description,
      name: "",
    };
    bounds.extend(position);
    markers.push(newMarker);
  });
  return { markers, bounds };
}


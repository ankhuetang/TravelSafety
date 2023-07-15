const MapConfigs = () => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const MAP_ID = process.env.REACT_APP_GOOGLE_MAPS_ID;
  const US_BOUNDS = {
    north: 49.3457868,
    west: -124.7844079,
    east: -66.9513812,
    south: 24.7433195,
  };
  const temp_center = {
    lat: 34.052235,
    lng: -118.243683,
  };
  const options = {
    minZoom: 9,
    maxZoom: 17,
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
  const libraries = [
    "places",
    "core",
    "geometry",
    "geocoding",
    "visualization",
  ];
  return { API_KEY, MAP_ID, US_BOUNDS, temp_center, options, libraries };
};
export default MapConfigs;

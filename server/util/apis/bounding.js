function getBoundsFromLatLng(lat, lng, radiusInKm) {
	var lat_change = radiusInKm / 111.2;
	var lon_change = Math.abs(Math.cos(lat * (Math.PI / 180)));
	var bounds = {
		lat_min: (lat - lat_change).toFixed(3),
		lon_min: (lng - lon_change).toFixed(3),
		lat_max: (lat + lat_change).toFixed(3),
		lon_max: (lng + lon_change).toFixed(3),
	};
	return `${bounds.lat_min},${bounds.lon_min},${bounds.lat_max},${bounds.lon_max}`;
}

module.exports = getBoundsFromLatLng;

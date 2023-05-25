//call traffic APIs for data
const axios = require('axios');
const getCoordsForAddress = require("./location");

const API_KEY = 'AoSfUaGcI1rxajoAufjRIaLrL9ZBuHr8fWiVTYdRX-zkgwt9x5UFQfWfK3u9_e_s'

function getBoundsFromLatLng(lat, lng, radiusInKm){
    var lat_change = radiusInKm/111.2;
    var lon_change = Math.abs(Math.cos(lat*(Math.PI/180)));
    var bounds = { 
        lat_min: (lat - lat_change).toFixed(3),
        lon_min: (lng - lon_change).toFixed(3),
        lat_max: (lat + lat_change).toFixed(3),
        lon_max: (lng + lon_change).toFixed(3)
    };
    return `${bounds.lat_min},${bounds.lon_min},${bounds.lat_max},${bounds.lon_max}`;
}

const address = "Barcelona";

async function getTrafficInfo(address) {
    let location;
    try {
        location = await getCoordsForAddress(address);
    } catch(error) {
        console.error(error);
        return;
    }

    let boundingBox;
    try {
        boundingBox = getBoundsFromLatLng(location.lat, location.lng, 2);
    } catch (error) {
        console.log('Cant calculate boundingBox');
    }

    const response = await axios.get(`http://dev.virtualearth.net/REST/v1/Traffic/Incidents/${boundingBox}?key=${API_KEY}`);

    const data = response.data;

    if (!data || data.statusCode !== 200){
        throw new Error("No data available")
    }
    return data;
}

getTrafficInfo(address)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = getTrafficInfo;


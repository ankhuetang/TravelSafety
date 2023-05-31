//call traffic APIs for data
const axios = require('axios');
const getCoordsForAddress = require('./location');
const getBoundsFromLatLng = require('./bounding');
require('dotenv').config({ path: '../.env' });


const API_KEY = process.env.TRAFFIC_API_KEY;
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


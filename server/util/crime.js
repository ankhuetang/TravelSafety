const getCoordsForAddress = require("./location");

var Amadeus = require("amadeus");

const API_KEY = 'SCIJbm8FW1PGvdURVLS8F9F1uInZDem3'
const API_SECRET = 'U6OftKerP93GZVtl'

// const location = {
//     latitude: 40.767663,
//     longitude: -73.971416,
// }

const address = "Barcelona";

async function getSafetyScore(address){
    let location;
    try {
        location = await getCoordsForAddress(address);
    } catch (error) {
        console.error(error);
        return;
    }

    var amadeus = new Amadeus({
        clientId: API_KEY,
        clientSecret: API_SECRET
    });
    
    const response = await amadeus.safety.safetyRatedLocations.get({
        latitude: location.lat,
        longitude: location.lng,
        radius: 1
    })

    const data = response.data;
    if (!data || response.statusCode !== 200){
        throw new Error("No data available")
    }

    return data;
}

getSafetyScore(address)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });

module.exports = getSafetyScore;
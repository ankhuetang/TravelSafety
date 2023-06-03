const getCoordsForAddress = require('./location');
require('dotenv').config({ path: '../../.env' });

var Amadeus = require('amadeus');

const API_KEY = process.env.SAFETY_API_KEY;
const API_SECRET = process.env.SAFETY_API_SECRET;

// const location = {
//     latitude: 40.767663,
//     longitude: -73.971416,
// }

// const address = 'Barcelona';

async function getSafetyScore(location) {
	var amadeus = new Amadeus({
		clientId: API_KEY,
		clientSecret: API_SECRET,
	});

	const response = await amadeus.safety.safetyRatedLocations.get({
		latitude: location.lat,
		longitude: location.lng,
		radius: 1,
	});

	const data = response.data;
	if (!data || response.statusCode !== 200) {
		console.error(err);
	}

	return data;
}

// getSafetyScore(address)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.error(error);
// 	});

module.exports = getSafetyScore;

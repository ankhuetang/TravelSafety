const getCoordsForAddress = require('./location');
require('dotenv').config({ path: '../../.env' });

var Amadeus = require('amadeus');

const API_KEY = process.env.SAFETY_API_KEY;
const API_SECRET = process.env.SAFETY_API_SECRET;

// const location = {
// 	lat: 34.0522,
// 	lng: -118.2437,
// };

// const rad = 1;

// const address = 'Mission District, San Francisco';

async function getSafetyScore(location, radius) {
	var amadeus = new Amadeus({
		clientId: API_KEY,
		clientSecret: API_SECRET,
	});

	const response = await amadeus.safety.safetyRatedLocations.get({
		latitude: location.lat,
		longitude: location.lng,
		radius: radius,
	});

	const data = response.data;
	// console.log(data);
	if (!data || response.statusCode !== 200) {
		console.log('No safety data available');
		return [];
	}

	return data;
}

// getSafetyScore(location, rad)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.error(error);
// 	});

module.exports = getSafetyScore;

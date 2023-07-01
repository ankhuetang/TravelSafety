const getCoordsForAddress = require('./location');
require('dotenv').config({ path: '../../.env' });

var Amadeus = require('amadeus');

const API_KEY = process.env.SAFETY_API_KEY;
const API_SECRET = process.env.SAFETY_API_SECRET;

// const location = {
// 	lat: 37.7590624,
// 	lng: -122.4140595,
// };

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
	if (!data || response.statusCode !== 200) {
		console.log('No safety data available');
	}

	return data;
}

// getSafetyScore(location)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.error(error);
// 	});

module.exports = getSafetyScore;

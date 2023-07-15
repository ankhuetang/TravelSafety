//geoCoding: get location for an address
const axios = require('axios');
require('dotenv').config({ path: '../../.env' });
const API_KEY = process.env.LOCATION_API_KEY;

//const address = '212 Huxley Avenue, Providence';

async function getCoordsForAddress(address) {
	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
			address
		)}&key=${API_KEY}`
	);

	const data = response.data;
	// console.log(data);

	if (!data || data.status === 'ZERO_RESULTS') {
		throw new Error('Could not find data for given address.');
	}

	const coordinates = data.results[0].geometry.location;

	return coordinates;
}

// getCoordsForAddress(address)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

module.exports = getCoordsForAddress;

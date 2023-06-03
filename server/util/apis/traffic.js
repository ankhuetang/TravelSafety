//call traffic APIs for data
const axios = require('axios');
const getBoundsFromLatLng = require('./bounding');
require('dotenv').config({ path: '../../.env' });

const API_KEY = process.env.TRAFFIC_API_KEY;
// const location = { lat: 41.3873974, lng: 2.168568 };

async function getTrafficInfo(location) {
	let boundingBox;
	try {
		boundingBox = getBoundsFromLatLng(location.lat, location.lng, 1);
	} catch (error) {
		console.log('Cant calculate boundingBox');
	}

	const response = await axios.get(
		`http://dev.virtualearth.net/REST/v1/Traffic/Incidents/${boundingBox}?key=${API_KEY}`
	);

	const data = response.data;

	if (!data || data.statusCode !== 200) {
		throw new Error('No data available');
	}
	return data;
}

// getTrafficInfo(address)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

module.exports = getTrafficInfo;

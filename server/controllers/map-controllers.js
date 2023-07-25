const getSafetyScore = require('../util/apis/safety');
const getCoordsForAddress = require('../util/apis/location');
const getTrafficInfo = require('../util/apis/traffic');

const mapUtil = require('../util/map');

// Only req, res, next, other util
const getSearchByAddress = async (req, res, next) => {
	try {
		// 1a. Get lat, lon from address
		console.log(req.body);
		const { address, coordinates, radius } = req.body;
		let rad = Math.min(10, Math.round(radius));
		if (rad === 0) {
			rad = 10;
		}

		// 1b. Check if place exist:
		let place;
		try {
			place = await mapUtil.getPlaceByAddress(address);
		} catch (error) {
			return next(error);
		}
		// 1c. Save place
		if (!place || place.length === 0) {
			try {
				place = await mapUtil.createPlace(address, coordinates);
			} catch (error) {
				place = [];
				return next(error);
			}
		}

		// 2. Get Traffic documents using GeoSearch
		let traffic = [];
		try {
			traffic = await mapUtil.getTrafficByLocation(coordinates, rad);
			console.log('TRAFFIC DB is ', traffic);
		} catch (error) {
			return next(error);
		}
		// 3a. Check if no doc return, then make req to api
		//neu traffic la array thi fai check if traffic.length ===0 nha
		// if (!traffic || traffic.length === 0) {
		// 	let newTrafficInfo = await getTrafficInfo(coordinates, rad);
		// 	if (newTrafficInfo.length !== 0) {
		// 		// 3b. Save traffic (mongo)
		// 		traffic = await mapUtil.createTraffic(newTrafficInfo);
		// 		// console.log('TRAFFIC IS '.traffic);
		// 	} else {
		// 		traffic = [];
		// 	}
		// }

		// 4.Get SafetyByLocation in DB
		let safetyScore = [];
		try {
			safetyScore = await mapUtil.getSafetyByLocation(coordinates, rad);
			console.log('SAFETY IS ', safetyScore);
		} catch (err) {
			return next(err);
		}

		// // 5a. Check if no doc return, then make req to api
		// if (safetyScore.length === 0) {
		// 	let newSafetyScore = await getSafetyScore(coordinates, rad);
		// 	console.log(newSafetyScore);
		// 	if (newSafetyScore.length !== 0) {
		// 		// 5b. Save safetyScore (mongo)
		// 		safetyScore = await mapUtil.createSafety(newSafetyScore);
		// 	} else {
		// 		safetyScore = [];
		// 	}
		// }

		//6. Get CrimeByLocation in DB
		let crime = [];
		try {
			crime = await mapUtil.getCrimeByLocation(coordinates, rad);
			// console.log('CRIME LIST IS ', crime);
		} catch (err) {
			return next(err);
		}

		if (crime.length === 0) {
			console.log('No crime data available');
		}
		// 7. Respond Object (2 key: safetyScore, traffic)
		res.status(201).json({
			place: place,
			safetyScore: safetyScore,
			traffic: traffic,
			Crime: crime,
		});
	} catch (error) {
		console.log(error);
		res.send([]);
	}
};

// const res = await getSearchByAddress();

exports.getSearchByAddress = getSearchByAddress;

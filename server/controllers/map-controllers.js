const getSafetyScore = require('../util/apis/safety');
const getCoordsForAddress = require('../util/apis/location');
const getTrafficInfo = require('../util/apis/traffic');

const mapUtil = require('../util/map');

// Only req, res, next, other util
const getSearchByAddress = async (req, res, next) => {
	try {
		// 1a. Get lat, lon from address
		const { address, coordinates, radius } = req.body;

		// let coordinates;
		// try {
		// 	coordinates = await getCoordsForAddress(address);
		// } catch (error) {
		// 	console.error(error);
		// 	return;
		// }
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
				return next(error);
			}
		}

		// 2. Get Traffic documents using GeoSearch
		let traffic;
		try {
			traffic = await mapUtil.getTrafficByLocation(coordinates, radius);
		} catch (error) {
			return next(error);
		}

		// 3a. Check if no doc return, then make req to api
		//neu traffic la array thi fai check if traffic.length ===0 nha
		if (!traffic || traffic.length === 0) {
			let newTrafficInfo = await getTrafficInfo(coordinates, radius);

			// 3b. Save traffic (mongo)
			traffic = await mapUtil.createTraffic(newTrafficInfo);
		}

		// 4.Get SafetyByLocation in DB
		let safetyScore;
		try {
			safetyScore = await mapUtil.getSafetyByLocation(coordinates, radius);
			// console.log('safety is ', safetyScore);
		} catch (err) {
			return next(err);
		}

		// 5a. Check if no doc return, then make req to api
		if (safetyScore.length === 0) {
			let newSafetyScore = await getSafetyScore(coordinates, radius);

			// 5b. Save safetyScore (mongo)
			safetyScore = await mapUtil.createSafety(newSafetyScore);
		}

		//6. Get CrimeByLocation in DB
		let crime;
		try {
			crime = await mapUtil.getCrimeByLocation(coordinates, radius);
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
			// Crime: crime,
		});
	} catch (error) {
		console.log(error.message);
	}
};

// const res = await getSearchByAddress();

exports.getSearchByAddress = getSearchByAddress;

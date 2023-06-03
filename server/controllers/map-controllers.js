const getSafetyScore = require('../util/apis/safety');
const getCoordsForAddress = require('../util/apis/location');
const getTrafficInfo = require('../util/apis/traffic');

const mapUtil = require('../util/map');

// Only req, res, next, other util
const getSearchByAddress = async (req, res, next) => {
	// 1a. Get lat, lon from address
	const { address } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		console.error(error);
		return;
	}
	// 1b. Check if place exist:
	let place;
	try {
		place = await mapUtil.getPlaceByAddress(address);
	} catch (error) {
		return next(error);
	}
	// 1c. Save place
	if (!place) {
		try {
			newPlace = await mapUtil.createPlace(address, coordinates);
		} catch (error) {
			return next(error);
		}
	}

	// 2. Get Traffic documents using GeoSearch
	let traffic;
	try {
		traffic = await mapUtil.getTrafficByLocation(coordinates);
	} catch (error) {
		return next(error);
	}

	// 3a. Check if no doc return, then make req to api
	//neu traffic la array thi fai check if traffic.length ===0 nha
	if (!traffic || traffic.length === 0) {
		console.log(coordinates);
		let newTrafficInfo = await getTrafficInfo(coordinates);

		console.log(newTrafficInfo);
		// 3b. Save traffic (mongo)
		traffic = await mapUtil.createTraffic(newTrafficInfo);
	}

	console.log(traffic);

	// 4.Get SafetyByLocation in DB
	let safetyScore;
	try {
		safetyScore = await mapUtil.getSafetyByLocation(coordinates);
		console.log('safety is ', safetyScore);
	} catch (err) {
		return next(err);
	}

	// 5a. Check if no doc return, then make req to api
	if (safetyScore.length === 0) {
		let newSafetyScore = await getSafetyScore(coordinates);
		// console.log(newSafetyScore);

		// 5b. Save safetyScore (mongo)
		safetyScore = await mapUtil.createSafety(newSafetyScore);
	}

	// 6. Respond Object (2 key: safetyScore, traffic)
	res.status(201).json({
		Place: place,
		SafetyScore: safetyScore,
		Traffic: traffic,
	});
};

// const res = await getSearchByAddress();

exports.getSearchByAddress = getSearchByAddress;

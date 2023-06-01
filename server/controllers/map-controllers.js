//get crime data, get traffice data from database
const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const getSafetyScore = require('../util/crime');
const getCoordsForAddress = require('../util/location');
const getTrafficInfo = require('../util/traffic');

const Crime = require('../models/crime');
const Traffic = require('../models/traffic');
const Place = require('../models/place');
const User = require('../models/user');

// Only req, res, next, other util
const getPlaceByAddress = async (req, res, next) => {
	// 1a. Get lat, lon from address
	const { address, userId } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}
	// 1b. Check if place exist:
	let place;
	try {
		place = await getPlaceByAddress(address);
	} catch (error) {
		return next(error);
	}
	// 1c. Save place
	if (!place) {
		createPlace(address);
	}

	// 2. Get Traffic documents using GeoSearch
	let traffic;
	try {
		traffic = await getTrafficByLocation(coordinates);
	} catch (error) {
		return next(error);
	}
	// 3a. Check if no doc return, then make req to api
	if (!traffic) {
		const newTrafficInfo = getTrafficInfo(address);

		// 3b. Save traffic (mongo)
		traffic = createTraffic(newTrafficInfo);
	}

	// 4.Get SafetyScore by address
	let safetyScore;
	try {
		safetyScore = await getSafetyScore(address);
	} catch (error) {
		return next(error);
	}
	// 5a. Check if no doc return, then make req to api
	if (!safetyScore) {
		const newSafetyScore = getSafetyByLocation(coordinates);

		// 5b. Save safetyScore (mongo)
		safetyScore = createSafety(newSafetyScore);
	}

	// 6. Respond Object (2 key: crime, traffic)
	res.status(201).json({
		SafetyScore: safetyScore,
		Traffic: traffic,
	});
};

//createPlace: getCrimeForAddress + getTrafficForAddress => push under a long/lat
const createPlace = async (req, res, next) => {
	const { address, userId } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	//add crimes and traffic arrays by using createCrime, createTraffic.
	const createdPlace = new Place({
		address: address,
		location: coordinates,
		creator: userId,
	});

	let user;
	try {
		user = await User.findById(userId);
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError('Could not find user for provided id.', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdPlace.save({ session: sess });
		user.places.push(createdPlace);
		await user.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		);
		return next(error);
	}

	// res.status(201).json({ place: createdPlace });
};

//getPlaceByAddress
async function getPlaceByAddress(address) {
	// let places;
	let place;
	try {
		place = await Place.findById(address);
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again later.',
			500
		);
		return next(error);
	}

	return place;
}

//getPlacesByUserId
async function getPlacesByUserId(userId) {
	let userWithPlaces;
	try {
		userWithPlaces = await User.findById(userId).populate('places');
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!userWithPlaces || userWithPlaces.places.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id.', 404)
		);
	}

	res.json({
		places: userWithPlaces.places.map((place) =>
			place.toObject({ getters: true })
		),
	});
}

//createSafety (push data into database)
async function createSafety(safetyScores) {
	const createdCrimes = [];

	for (const safetyScore of safetyScores) {
		const createdSafety = new Crime({
			name: safetyScore.name,
			subType: safetyScore.subType,
			location: {
				lat: safetyScore.geoCode.latitude,
				lng: safetyScore.geoCode.longitude,
			},
			safetyScore: safetyScore.safetyScore,
		});

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			await createdSafety.save({ session: sess });
			await sess.commitTransaction();
			createdCrimes.push(createdSafety);
		} catch (err) {
			console.error(err);
		}
	}

	return createdCrimes;
}

//createTraffic
async function createTraffic({ trafficInfos }) {
	const createdTraffic = [];

	for (const trafficInfo of trafficInfos.resourceSets[0].resources) {
		const traffic = new Traffic({
			description: trafficInfo.description,
			detour: trafficInfo.detour,
			location: {
				lat: trafficInfo.point.coordinates[1],
				lng: trafficInfo.point.coordinates[0],
			},
			roadClosed: trafficInfo.roadClosed,
			type: trafficInfo.type,
		});

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			if (traffic.roadClosed === true) {
				await traffic.save({ session: sess });
				await sess.commitTransaction();
				createdTraffic.push(traffic);
			}
		} catch (error) {
			console.error(error);
		}
	}

	return createdTraffic;
}

//getSafetyByLocation(retrieve data from database and sends back response)
async function getSafetyByLocation(coordinates) {
	let safety;
	try {
		safety = await Crime.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: coordinates,
					},
					$maxDistance: 1000, // in meters
				},
			},
		});
	} catch (err) {
		return next(err);
	}

	return safety;
}
//getTrafficbyaddress
async function getTrafficByLocation(coordinates) {
	let traffic;
	try {
		traffic = await Traffic.find({
			location: {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: coordinates,
					},
					$maxDistance: 1000, // in meters - TODO: make consistent with bounding box
				},
			},
		});
	} catch (err) {
		return next(err);
	}

	// if (!traffic) {
	// 	const error = new Error('Could not find traffic for given address');
	// 	return next(error);
	// }

	return traffic;
}

exports.createSafety = createSafety;
exports.getSafetyByLocation = getSafetyByLocation;
exports.createPlace = createPlace;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createTraffic = createTraffic;
exports.getTrafficByLocation = getTrafficByLocation;

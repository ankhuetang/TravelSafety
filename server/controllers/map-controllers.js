//get crime data, get traffice data from database
const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const getSafetyScore = require('../util/crime');
const getCoordsForAddress = require('../util/location');

const Crime = require('../models/crime');
const Traffic = require('../models/traffic');
const Place = require('../models/place');
const User = require('../models/user');

// Only req, res, next, other util
const getPlaceByAddress = async (req, res, next) => {
	// 1a. Get lat, lon from address
	// const { address } = req.body;
	// 1b. Save place
	// 2. Get Traffic documents using GeoSearch
	// 3a. Check if no doc return, then make req to api
	// 3b. Save traffic (mongo)
	// 4.Get Crime by address
	// 5a. Check if no doc return, then make req to api
	// 5b. Save crime (mongo)
	// 6. Respond Object (2 key: crime, traffic)
};
// Todo: Rename crime

//createCrime (push data into database)
const createCrime = async (req, res, next) => {
	const { address } = req.body;

	let safetyScores;
	try {
		safetyScores = await getSafetyScore(address);
	} catch (err) {
		return next(err);
	}

	safetyScores.map(async (safetyScore) => {
		const createdCrime = new Crime({
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
			await createdCrime.save({ session: sess });
			await sess.commitTransaction();
		} catch (err) {
			return next(err);
		}

		res.status(201).json({ crime: createdCrime });
	});
};

//createTraffic
const createTraffic = async (req, res, next) => {
	const { address } = req.body;

	let trafficInfo;
	try {
		trafficInfo = getTrafficInfo(address);
	} catch (error) {
		return next(error);
	}

	trafficInfo.map(async (trafficInfo) => {
		const createdTraffic = new Traffic({
			description: trafficInfo.description,
			detour: trafficInfo.detour,
			location: {
				lat: trafficInfo.geoCode.latitude,
				lng: trafficInfo.geoCode.longitude,
			},
			roadClosed: trafficInfo.roadClosed,
			type: trafficInfo.type,
		});

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			await createdTraffic.save({ session: sess });
			await sess.commitTransaction();
		} catch (error) {
			return next(error);
		}

		console.log(createdTraffic);
		res.status(201).json({ traffic: createdTraffic });
	});
};

//getCrimebyaddress (retrieve data from database and sends back response)
const getCrimeByAddress = async (req, res, next) => {
	const { address } = req.body;

	let crime;
	try {
		crime = await Crime.find({ name: address });
	} catch (err) {
		return next(err);
	}

	if (!crime) {
		const error = new Error('Could not find crime for given address');
		return next(error);
	}

	res.json({ crime: crime.toObject({ getters: true }) });
};

//getTrafficbyaddress
const getTrafficByAddress = async (req, res, next) => {
	const { address } = req.body;

	let traffic;
	try {
		traffic = await Traffic.find({ address: address });
	} catch (err) {
		return next(err);
	}

	if (!traffic) {
		const error = new Error('Could not find traffic for given address');
		return next(error);
	}

	res.json({ traffic: traffic.toObject({ getters: true }) });
};

//createPlace
const createPlace = async (req, res, next) => {
	const { address, userId } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

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

	res.status(201).json({ place: createdPlace });
};

//getPlacesByUserId
const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	// let places;
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
};

exports.createCrime = createCrime;
exports.getCrimeByAddress = getCrimeByAddress;
exports.createPlace = createPlace;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createTraffic = createTraffic;
exports.getTrafficByAddress = getTrafficByAddress;

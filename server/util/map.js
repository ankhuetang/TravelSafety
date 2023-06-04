const mongoose = require('mongoose');

const Safety = require('../models/safety');
const Traffic = require('../models/traffic');
const Place = require('../models/place');
const User = require('../models/user');

//createPlace
async function createPlace(address, coordinates) {
	const createdPlace = new Place({
		address: address,
		location: {
			lat: coordinates.lat,
			lng: coordinates.lng,
		},
	});

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdPlace.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.error(err);
	}
	return createdPlace;
}

//getPlaceByAddress
async function getPlaceByAddress(address) {
	// let places;
	let place;
	try {
		place = await Place.find({ address: address });
	} catch (err) {
		console.error(err);
	}
	return place;
}

//createSafety (push data into database)
async function createSafety(safetyScores) {
	const createdSafeties = [];

	for (const safetyScore of safetyScores) {
		const createdSafety = new Safety({
			name: safetyScore.name,
			subType: safetyScore.subType,
			location: {
				coordinates: [
					safetyScore.geoCode.longitude,
					safetyScore.geoCode.latitude,
				],
			},
			safetyScore: {
				overall: safetyScore.safetyScores.overall,
				lgbtq: safetyScore.safetyScores.lgbtq,
				medical: safetyScore.safetyScores.medical,
				physicalHarm: safetyScore.safetyScores.physicalHarm,
				politicalFreedom: safetyScore.safetyScores.politicalFreedom,
				theft: safetyScore.safetyScores.theft,
				women: safetyScore.safetyScores.women,
			},
		});

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			await createdSafety.save({ session: sess });
			await sess.commitTransaction();
			createdSafeties.push(createdSafety);
		} catch (err) {
			console.error(err);
		}
	}

	return createdSafeties;
}

//createTraffic
async function createTraffic(trafficInfos) {
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
		// Create a geospatial index on the location field
		await Safety.collection.createIndex({ location: '2dsphere' });

		safety = await Safety.find({
			location: {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [coordinates.lng, coordinates.lat],
					},
					$maxDistance: 1000, // in meters
				},
			},
		});
	} catch (err) {
		console.error(err);
	}

	return safety;
}

//getTrafficbyaddress
async function getTrafficByLocation(coordinates) {
	let traffic;
	// Create a geospatial index on the location field
	await Traffic.collection.createIndex({ location: '2dsphere' });
	try {
		traffic = await Traffic.find({
			location: {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [coordinates.lng, coordinates.lat],
					},
					$maxDistance: 1000, // in meters - TODO: make consistent with bounding box
				},
			},
		});
	} catch (err) {
		console.error(err);
	}

	return traffic;
}

//getPlacesByUserId
async function getPlacesByUserId(userId) {
	let userWithPlaces;
	try {
		userWithPlaces = await User.findById(userId).populate('places');
	} catch (err) {
		throw new Error('get place by userid failed');
	}

	if (!userWithPlaces || userWithPlaces.places.length === 0) {
		throw new Error('get place by userid failed');
	}

	res.json({
		places: userWithPlaces.places.map((place) =>
			place.toObject({ getters: true })
		),
	});
}

exports.createPlace = createPlace;
exports.getPlaceByAddress = getPlaceByAddress;

exports.createSafety = createSafety;
exports.getSafetyByLocation = getSafetyByLocation;

exports.createTraffic = createTraffic;
exports.getTrafficByLocation = getTrafficByLocation;

exports.getPlacesByUserId = getPlacesByUserId;

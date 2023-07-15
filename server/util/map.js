const mongoose = require('mongoose');

const Safety = require('../models/safety');
const Traffic = require('../models/traffic');
const Place = require('../models/place');
const User = require('../models/user');
const Crime = require('../models/crime');

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
		console.log(err);
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
		console.log(err);
	}
	return place;
}

//createSafety (push data into database)
async function createSafety(safetyScores) {
	const createdSafeties = [];
	const uniqueSafety = safetyScores.filter(
		(obj, index, self) =>
			index ===
			self.findIndex(
				(o) =>
					o.geoCode.latitude === obj.geoCode.latitude &&
					o.geoCode.longitude === obj.geoCode.longitude
			)
	);
	console.log(uniqueSafety);

	for (const safetyScore of uniqueSafety) {
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
			console.log(err);
		}
	}

	return createdSafeties;
}

//createTraffic
async function createTraffic(trafficInfos) {
	const createdTraffic = [];
	const uniqueTraffic = trafficInfos.resourceSets[0].resources.filter(
		(obj, index, self) =>
			index ===
			self.findIndex(
				(o) =>
					o.point.coordinates[0] === obj.point.coordinates[0] &&
					o.point.coordinates[1] === obj.point.coordinates[1]
			)
	);
	for (const trafficInfo of uniqueTraffic) {
		// console.log(trafficInfo.description);
		const traffic = new Traffic({
			description: trafficInfo.description,
			detour: trafficInfo.detour,
			location: {
				coordinates: [
					trafficInfo.point.coordinates[1],
					trafficInfo.point.coordinates[0],
				],
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
			console.log(error);
		}
	}

	return createdTraffic;
}

//getSafetyByLocation(retrieve data from database and sends back response)
async function getSafetyByLocation(coordinates, radius) {
	let safety;
	try {
		safety = await Safety.find({
			location: {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [coordinates.lng, coordinates.lat],
					},
					$maxDistance: radius * 1000, // in meters
				},
			},
		});
	} catch (err) {
		console.log(err);
	}

	return safety;
}

//getTrafficbyaddress
async function getTrafficByLocation(coordinates, radius) {
	let traffic;
	try {
		traffic = await Traffic.find({
			location: {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [coordinates.lng, coordinates.lat],
					},
					$maxDistance: radius * 1000, // radius in km
				},
			},
		});
	} catch (err) {
		console.log(err);
	}

	return traffic;
}

async function createCrime(crimeList) {
	const createdCrimes = [];

	for (const crime of crimeList) {
		const createdCrime = new Crime({
			type: crime.type,
			address: crime.address,
			date: new Date(crime.date),
			location: {
				coordinates: [crime.location.longitude, crime.location.latitude],
			},
		});

		try {
			await createdCrime.save();
			createdCrimes.push(createdCrime);
		} catch (err) {
			console.log(err);
		}
	}

	return createdCrimes;
}

async function getCrimeByLocation(coordinates, radius) {
	let crime;
	try {
		crime = await Crime.find({
			location: {
				$nearSphere: {
					$geometry: {
						type: 'Point',
						coordinates: [coordinates.lng, coordinates.lat],
					},
					$maxDistance: radius * 1000, // in meters - TODO: make consistent with bounding box
				},
			},
		});
		console.log('GET CRIME FROM DB SUCCESSFULLY');
	} catch (err) {
		console.log(err);
	}
	return crime; //return list of crimes
}
// const coordinates = {
// 	lng: -71.4269316,
// 	lat: 41.8235906,
// };
// getCrimeByLocation(coordinates, 2)
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((err) => {
// 		console.log('ERRORR ', err);
// 	});

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

exports.createCrime = createCrime;
exports.getCrimeByLocation = getCrimeByLocation;

exports.getPlacesByUserId = getPlacesByUserId;

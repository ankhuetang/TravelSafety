const mongoose = require('mongoose');
const Subscription = require('../models/subscription');

// createSubscription
async function createSubscription(address, radius, duration) {
	const expireDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000); // duration in ms
	const createdSubscription = new Subscription({
		address: address,
		radius: radius,
		duration: duration,
		expireAt: expireDate, // duration in second
		// creator --> take user id
	});

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdSubscription.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.error(err);
	}
	return createdSubscription;
}

// get all subscriptions
async function getSubscription() {
	let subscription;
	try {
		subscription = await Subscription.find();
	} catch (error) {
		console.error(error);
	}
	return subscription;
}

// Get subscription by id
async function getSubscriptionById(userId) {
	let subscription;
	try {
		subscription = await Subscription.find({ creator: userId });
	} catch (error) {
		console.error(error);
	}
	return subscription;
}
exports.createSubscription = createSubscription;
exports.getSubscription = getSubscription;
exports.getSubscriptionById = getSubscriptionById;

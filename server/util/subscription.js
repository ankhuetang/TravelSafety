const mongoose = require('mongoose');
const Subscription = require('../models/subscription');

// createSubscription
async function createSubscription(address, radius, duration) {
	const createdSubscription = new Subscription({
		address: address,
		radius: radius,
		duration: duration,
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

// getSubscription
async function getSubscriptionByAddress(address) {
	let subscription;
	try {
		subscription = await Subscription.find({ address: address });
	} catch (error) {
		console.error(error);
	}
	return subscription;
}
exports.createSubscription = createSubscription;
exports.getSubscriptionByAddress = getSubscriptionByAddress;

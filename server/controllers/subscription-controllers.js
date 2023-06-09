const subUtil = require('../util/subscription');

const getSubscription = async (req, res, next) => {
	const { address } = req.body;

	let subscription;
	try {
		subscription = await subUtil.getSubscriptionByAddress(address);
	} catch (error) {
		console.error(error);
	}

	res.status(201).json({
		Subscription: subscription,
	});
};

const subscribe = async (req, res, next) => {
	const { address, radius, duration } = req.body;

	let subscription;
	try {
		subscription = await subUtil.createSubscription(address, radius, duration);
	} catch (error) {
		console.error(error);
	}

	res.status(201).json({
		Subscription: subscription,
	});
};

exports.getSubscription = getSubscription;
exports.subscribe = subscribe;
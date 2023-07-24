const subUtil = require('../util/subscription');

const getSubscription = async (req, res, next) => {
	// console.log('getSubscription called with req.user:', req.user);
	const userId = req.user;
	// console.log('userId is:', userId);

	let subscription;
	try {
		subscription = await subUtil.getSubscriptionById(userId);
		// console.log('subscriptions: ', subscription);
	} catch (error) {
		console.log('There is an error in getSubscription');
		console.error(error);
	}

	res.status(201).json({
		Subscription: subscription,
	});
};

// axios POST
// private
// add them userID vao destructor
const subscribe = async (req, res, next) => {
	const { location: address, radius, duration, coordinate } = req.body;
	// console.log(req.user);
	// console.log(req.user.id);
	const userID = req.user;
	console.log('userID: ', userID);

	let subscription;
	try {
		subscription = await subUtil.createSubscription(
			address,
			radius,
			duration,
			userID,
			coordinate
		);
		console.log('created subscription: ', subscription);
	} catch (error) {
		console.error(error);
	}

	res.status(201).json({
		Subscription: subscription,
	});
};

exports.getSubscription = getSubscription;
exports.subscribe = subscribe;

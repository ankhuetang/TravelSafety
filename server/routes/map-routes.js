const express = require('express');
const { check } = require('express-validator');

const mapController = require('../controllers/map-controllers');
const subscriptionController = require('../controllers/subscription-controllers');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.post(
	'/data',
	[check('address').not().isEmpty()],
	mapController.getSearchByAddress
);

//check for authentication for protected routes
//router.use(checkAuth);

router.post(
	'/subscription',
	[
		checkAuth, // get userID by calling this
		[
			check('address').not().isEmpty(),
			check('radius').not().isEmpty(),
			check('duration').not().isEmpty(),
		],
	],
	subscriptionController.subscribe
);

router.get('/profile', checkAuth, subscriptionController.getSubscription);

module.exports = router;

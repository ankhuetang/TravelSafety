const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	console.log('check-auth called');
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error('Authentication failed!');
		}
		//verify token from headers from frontend
		const decodedToken = jwt.verify(token, 'supersecret_dont_share');
		req.userData = { userId: decodedToken.userId };
		console.log('req.userData is: ', req.userData);
		next(); //continue w other middlewares in places/users routes
	} catch (err) {
		const error = new HttpError('Authentication failed!', 403);
		return next(error);
	}
};

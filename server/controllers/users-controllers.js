const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//signup
//login
const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Logging in failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError(
			'Invalid credentials, could not log you in.',
			403
		);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError(
			'Could not log you in, please check your credentials and try again.',
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError(
			'Invalid credentials, could not log you in.',
			403
		);
		return next(error);
	}

	// let token;
	// try {
	//   token = jwt.sign(
	//     { userId: existingUser.id, email: existingUser.email },//payload
	//     'supersecret_dont_share',
	//     { expiresIn: '1h' }
	//   );
	// } catch (err) {
	//   const error = new HttpError(
	//     'Logging in failed, please try again later.',
	//     500
	//   );
	//   return next(error);
	// }

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		//   token: token
	});
};

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

const User = require('../models/user');

//signup
const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { name, email, password } = req.body; //add phone

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError('Cannot access DB.', 500);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			'Email exists already, please login instead.',
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError(
			'Could not hash password, my bad, not your fault',
			500
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		password: hashedPassword,
		// phone,
	});
	console.log(createdUser);

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Failed to save your data to DB', 500);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email }, //payload
			'supersecret_dont_share',
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError('Failed to sign token', 500);
		return next(error);
	}

	res
		.status(201) //201 code means created
		.json({ userId: createdUser.id, email: createdUser.email, token: token });
};

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
		const error = new HttpError('Email does not exist', 403);
		return next(error);
	}

	//compare password in req with password in DB
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
		const error = new HttpError('Password not correct', 403);
		return next(error);
	}

	//sign token
	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email }, //payload
			'supersecret_dont_share',
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError('Failed to sign token', 500);
		return next(error);
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token,
	});
};

exports.signup = signup;
exports.login = login;

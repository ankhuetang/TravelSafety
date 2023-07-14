const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

router.post(
	'/signup',
	[
		check('name').not().isEmpty(),
		check('phone').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	usersController.signup
);

router.post(
	'/login',
	[
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	usersController.login
);

//router.use(checkAuth);
//user not defined error

router.get('/data', auth, async (req, res) => {
	try {
		// console.log('HELLUUUUU');
		const user = await User.findById(req.user).select('-password');
		console.log('USER IS ', user);
		res.json(user); // trong user co userID
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	phone: { type: String, required: false, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 6 },
	subscriptions: [
		{ type: mongoose.Types.ObjectId, required: false, ref: 'Subscription' },
	],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

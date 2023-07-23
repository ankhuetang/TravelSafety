const moment = require('moment-timezone');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const trafficSchema = new Schema({
	description: { type: String, required: true, unique: true },
	detour: { type: String },
	location: {
		type: { type: String, default: 'Point' },
		coordinates: {
			type: [Number],
			required: true,
			index: '2dsphere',
			unique: true,
		},
	},
	roadClosed: { type: Boolean, required: true },
	type: { type: Number, required: true },
	expiredAt: { type: Date, index: { expires: '3h' } },
});

trafficSchema.index({ location: '2dsphere' });
trafficSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 1 });
trafficSchema.plugin(uniqueValidator);

trafficSchema.pre('save', function (next) {
	const now = new Date();
	const expirationDate = moment(now)
		.add(3, 'hours')
		.tz('America/New_York')
		.toDate();
	console.log('Setting expiredAt:', expirationDate);
	this.expiredAt = expirationDate;
	next();
});

module.exports = mongoose.model('Traffic', trafficSchema);

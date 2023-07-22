const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const trafficSchema = new Schema({
	description: { type: String, required: true },
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
trafficSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
trafficSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Traffic', trafficSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const crimeSchema = new Schema({
	type: { type: String, required: true },
	address: { type: String, required: true },
	date: { type: Date, required: true },
	location: {
		type: { type: String, default: 'Point' },
		coordinates: {
			type: [Number],
			required: true,
			index: '2dsphere',
			unique: true,
		},
	},
	expiredAt: { type: Date, index: { expires: '24h' } },
});
crimeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Crime', crimeSchema);

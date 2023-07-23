const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const crimeSchema = new Schema({
	type: { type: String, required: true },
	address: { type: String, required: true },
	date: { type: Date },
	location: {
		type: { type: String, default: 'Point' },
		coordinates: {
			type: [Number],
			required: true,
			index: '2dsphere',
		},
	},
	expiredAt: { type: Date, index: { expires: '24h' } },
});
crimeSchema.index({ location: '2dsphere' });
crimeSchema.index({ type: 1, address: 1 }, { unique: true });
crimeSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
crimeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Crime', crimeSchema);

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

//consider adding index for querying

const safetySchema = new Schema({
	name: { type: String, required: true, unique: true },
	subType: { type: String, required: true },
	location: {
		type: { type: String, default: 'Point' },
		coordinates: {
			type: [Number],
			required: true,
			index: '2dsphere',
		},
	},
	safetyScore: {
		overall: { type: Number, required: true },
		lgbtq: { type: Number, required: true },
		medical: { type: Number, required: true },
		physicalHarm: { type: Number, required: true },
		politicalFreedom: { type: Number, required: true },
		theft: { type: Number, required: true },
		women: { type: Number, required: false },
	},
	expiredAt: { type: Date, index: { expires: '30d' } },
});
safetySchema.index({ location: '2dsphere' });
safetySchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
safetySchema.plugin(uniqueValidator);
// Expire lau hon (crime data lau outdated)

module.exports = mongoose.model('Safety', safetySchema);

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

//consider adding index for querying

const safetySchema = new Schema({
	name: { type: String, required: true },
	subType: { type: String, required: true },
	location: {
		type: { type: String, default: 'Point' },
		coordinates: {
			type: [Number],
			required: true,
			index: '2dsphere',
			unique: true,
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
	// place: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' }, //a crime document belongs to only 1 place
});
// Create a geospatial index on the location field
safetySchema.index({ location: '2dsphere' });
// Expire lau hon (crime data lau outdated)

module.exports = mongoose.model('Safety', safetySchema);

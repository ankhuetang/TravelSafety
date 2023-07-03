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
		},
	},
	roadClosed: { type: Boolean, required: true },
	type: { type: Number, required: true },
	expiredAt: { type: Date, index: { expires: '3h' } },
	// place: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' }, //a traffic document belongs to only 1 place
});

// Create a geospatial index on the location field
trafficSchema.index({ location: '2dsphere' });
// Expire ~2h (short)
module.exports = mongoose.model('Traffic', trafficSchema);

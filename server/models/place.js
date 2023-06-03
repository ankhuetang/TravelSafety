const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// User address => lat/long => save vao place => search crime trong DB => api

const placeSchema = new Schema({
	address: { type: String, required: true },
	location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	box: {
		lat1: { type: Number, required: false },
		lng1: { type: Number, required: false },
		lat2: { type: Number, required: false },
		lng2: { type: Number, required: false },
	},
	creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	crimes: [
		{
			type: mongoose.Types.ObjectId,
			required: false,
			ref: 'Crime',
		},
	],
	traffics: [
		{ type: mongoose.Types.ObjectId, required: false, ref: 'Traffic' },
	],
});

module.exports = mongoose.model('Place', placeSchema);

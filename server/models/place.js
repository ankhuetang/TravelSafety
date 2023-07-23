const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
	address: { type: String, required: true, unique: true },
	location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	creator: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
	expiredAt: { type: Date, index: { expires: '3h' } },
});

placeSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
placeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Place', placeSchema);

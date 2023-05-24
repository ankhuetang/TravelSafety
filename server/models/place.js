const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  box: {
    lat1: { type: Number, required: true },
    lng1: { type: Number, required: true },
    lat2: { type: Number, required: true },
    lng2: { type: Number, required: true }
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Place', placeSchema);
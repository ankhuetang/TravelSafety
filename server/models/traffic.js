const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const trafficSchema = new Schema({
  description: { type: String, required: true },
  detour: { type: String},
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  roadClosed: {type: Boolean, required: true},
  type: {type: Number, required: true},
  place: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' } //a traffic document belongs to only 1 place
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Traffic', trafficSchema);

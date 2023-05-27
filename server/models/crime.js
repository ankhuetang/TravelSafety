const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

//consider adding index for querying

const crimeSchema = new Schema({
  name: { type: String, required: true },
  subType: { type: String, required: true},
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  safetyScore: {
    overall: {type: Number, required: true},
    lbtq: {type: Number, required: true},
    medical: {type: Number, required: true},
    physicalHarm: {type: Number, required: true},
    politicalFreedom: {type: Number, required: true},
    theft: {type: Number, required: true},
    women: {type: Number, required: false}
  },
  place: { type: mongoose.Types.ObjectId, required: true, ref: 'Place' } //a crime document belongs to only 1 place
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Crime', crimeSchema);

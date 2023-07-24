const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
	address: { type: String, required: true },
	radius: { type: Number, required: true },
	duration: { type: Number, required: true },
	creator: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
	createAt: { type: Date, default: null },
	expireAt: { type: Date, default: null, index: { expires: 0 } },
	coordinate: { type: Schema.Types.Mixed, required: true },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

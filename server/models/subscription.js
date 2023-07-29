const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
	address: { type: String, required: true },
	radius: { type: Number, required: true },
	duration: { type: Number, required: true },
	creator: { type: mongoose.Types.ObjectId, required: false, ref: 'User' },
	expireAt: { type: Date, default: null },
});

subscriptionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
subscriptionSchema.plugin(uniqueValidator);

subscriptionSchema.pre('save', function (next) {
	const now = new Date();
	if (!this.expireAt || this.isModified('duration')) {
		const daysInMilliseconds = this.duration * 24 * 60 * 60 * 1000;
		this.expireAt = new Date(now.getTime() + daysInMilliseconds);
	}
	next();
});
module.exports = mongoose.model('Subscription', subscriptionSchema);
})

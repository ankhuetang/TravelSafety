const schedule = require('node-schedule');

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

const client = require('twilio')(accountSid, authToken);
const mapUtil = require('./map');
const getCoordsForAddress = require('./apis/location');
const getSubscription = require('./subscription');

async function sendAlerts() {
	const subscriptions = await getSubscription();
	subscriptions.forEach(async (sub) => {
		const { address, creator } = sub;
		const coordinates = getCoordsForAddress(address);

		//get traffic data
		let traffic;
		try {
			traffic = await mapUtil.getTrafficByLocation(coordinates);
		} catch (error) {
			return next(error);
		}
		if (!traffic || traffic.length === 0) {
			let newTrafficInfo;
			try {
				newTrafficInfo = await getTrafficInfo(coordinates);
				traffic = await mapUtil.createTraffic(newTrafficInfo);
			} catch (error) {
				console.log(error);
			}
		}
		let trafficDes = traffic.map((o) => o.description);
		trafficDes = trafficDes.join(', ');
		//get crime data
		let crime;
		try {
			crime = await mapUtil.getCrimeByLocation(coordinates);
		} catch (err) {
			return next(err);
		}
		if (crime.length === 0) {
			console.log('No crime data available');
		}

		client.messages
			.create({
				body:
					'Hello from TravelSafety. Traffic highlights: ' +
					trafficDes +
					'. Crime highlights: ' +
					crime,
				to: creator.phone, // Text your number
				from: '+18777504296', // From a valid Twilio number
			})
			.then((message) => console.log(message.sid));
	});
}

module.exports = {
	sendSMS: async () => {
		const alertJob = schedule.scheduleJob('0 0 * * *', sendAlerts);
	},
};

const schedule = require('node-schedule');
require('dotenv').config({ path: '../.env' });

// Your AccountSID and Auth Token from console.twilio.com
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

const client = require('twilio')(accountSid, authToken);
const mapUtil = require('./map');
const getCoordsForAddress = require('./apis/location');
const getTrafficInfo = require('./apis/traffic');
const subUtil = require('./subscription');

async function sendAlerts() {
	const subscriptions = await subUtil.getSubscription();
	// console.log(subscriptions);
	subscriptions.forEach(async (sub) => {
		const { address, radius, creator } = sub;
		// console.log(sub.coordinate);
		// const coordinates = { lng: coordinate.lng, lat: coordinate.lat };
		const coordinates = await getCoordsForAddress(address);
		// console.log(coordinates);
		// console.log(radius);
		//get traffic data
		let traffic;
		try {
			traffic = await mapUtil.getTrafficByLocation(coordinates, radius);
		} catch (error) {
			return next(error);
		}
		if (!traffic || traffic.length === 0) {
			let newTrafficInfo;
			try {
				newTrafficInfo = await getTrafficInfo(coordinates, radius);
				console.log(newTrafficInfo);
				traffic = await mapUtil.createTraffic(newTrafficInfo, radius);
			} catch (error) {
				console.log(error);
			}
		}
		// let trafficDes = '';
		// traffic.forEach((traff) => (trafficDes += traff.description));
		let trafficDes = traffic.map((o) => o.description);
		trafficDes = trafficDes.join(', ');
		// console.log(traffic);
		//get crime data
		let crime;
		try {
			crime = await mapUtil.getCrimeByLocation(coordinates, radius);
		} catch (err) {
			return next(err);
		}
		let crimeDes = '';
		if (crime.length === 0) {
			console.log('No crime data available');
		} else {
			crime.map((cri) => cri.type + ' at ' + cri.address);
			crimeDes = crime.join(',');
		}
		// console.log(crime);
		client.messages
			.create({
				body:
					'Hello from TravelSafety. Traffic highlights: ' +
					trafficDes +
					' Crime highlights: ' +
					crimeDes,
				to: creator.phone, // Text your number creator.phone
				from: '+18555201425', // From a valid Twilio number
			})
			.then((message) => console.log(message.sid));
	});
}

// module.exports = sendAlerts;

// sendAlerts()
// 	.then(() => console.log('sendAlerts() execution completed.'))
// 	.catch((err) => console.error('Error occurred in sendAlerts():', err));

// subUtil
// 	.getSubscription()
// 	.then((re) => console.log(re))
// 	.catch((e) => console.log(e));

module.exports = {
	sendSMS: async () => {
		const alertJob = schedule.scheduleJob('0 0 * * *', sendAlerts);
	},
};

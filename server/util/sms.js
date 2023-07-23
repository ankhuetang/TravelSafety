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
		let rad = Math.min(10, Math.round(radius));
		if (rad === 0) {
			rad = 1;
		}
		const coordinates = await getCoordsForAddress(address);
		//get traffic data

		// 2. Get Traffic documents using GeoSearch
		let traffic;
		try {
			traffic = await mapUtil.getTrafficByLocation(coordinates, rad);
		} catch (error) {
			// traffic = [];
			return next(error);
		}
		// 3a. Check if no doc return, then make req to api
		//neu traffic la array thi fai check if traffic.length ===0 nha
		if (!traffic || traffic.length === 0) {
			let newTrafficInfo = await getTrafficInfo(coordinates, rad);
			if (newTrafficInfo.length !== 0) {
				// 3b. Save traffic (mongo)
				traffic = await mapUtil.createTraffic(newTrafficInfo);
				console.log('TRAFFIC IS '.traffic);
			} else {
				traffic = [];
			}
		}

		traffic = traffic.filter(
			(traff) =>
				traff.type === 1 ||
				traff.type === 8 ||
				traffic.type === 8 ||
				traffic.type === 5
		);
		if (traffic.length >= 2) {
			traffic = traffic.slice(0, 2);
		}
		let trafficDes = '';
		traffic.forEach((traff) => (trafficDes += traff.description));
		// let trafficDes = traffic.map((o) => o.description);
		// trafficDes = trafficDes.join(' ');
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
			crimeDes = crime.join(' ');
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
		const alertJob = schedule.scheduleJob('0 1 * * *', sendAlerts);
	},
};

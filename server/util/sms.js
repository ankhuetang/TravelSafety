// Your AccountSID and Auth Token from console.twilio.com
const accountSid = '';
const authToken = '';

const client = require('twilio')(accountSid, authToken);
const mapUtil = require('./map');

//search in subsription
//for each subscription, getTraffic and getCrime
//if no data available, getTrafficInfo and scrapeCrime.

// client.messages
// 	.create({
// 		body: 'Hello from twilio-node',
// 		to: '+14019199381', // Text your number
// 		from: '+18777504296', // From a valid Twilio number
// 	})
// 	.then((message) => console.log(message.sid));

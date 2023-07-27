const schedule = require('node-schedule');
const User = require('../models/user');
require('dotenv').config({ path: '../.env' });

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
			rad = 10;
		}
		const coordinates = await getCoordsForAddress(address);
		//get traffic data

		// 2. Get Traffic documents using GeoSearch
		let traffic = [];
		try {
			traffic = await mapUtil.getTrafficByLocation(coordinates, rad);
			console.log('TRAFFIC DB is ', traffic);
		} catch (error) {
			return next(error);
		}
		// 3a. Check if no doc return, then make req to api
		//neu traffic la array thi fai check if traffic.length ===0 nha
		if (!traffic || traffic.length === 0) {
			let newTrafficInfo = await getTrafficInfo(coordinates, rad);
			if (newTrafficInfo.length !== 0) {
				// 3b. Save traffic (mongo)
				traffic = await mapUtil.createTraffic(newTrafficInfo);
				// console.log('TRAFFIC IS '.traffic);
			}
		}

		traffic = traffic.filter(
			(traff) =>
				traff.type === 1 ||
				traff.type === 8 ||
				traff.type === 5 ||
				traff.type === 11
		);
		if (traffic.length >= 2) {
			traffic = traffic.slice(0, 2);
		}

		//get crime data
		let crime;
		try {
			crime = await mapUtil.getCrimeByLocation(coordinates, 30);
			//console.log('crime is ', crime);
		} catch (err) {
			return next(err);
		}
		if (crime.length >= 2) {
			crime = crime.slice(0, 2);
		}

		const user = await User.findById(creator);
		const { email } = user;
		const msg = {
			to: `${email}`, // Change to your recipient
			from: 'safetravelerviettech@gmail.com', // Change to your verified sender
			subject: `Your safety report for ${address}`,
			//text: `From SafeTraveler, \nThis is your daily safety report for ${address}: \nTraffic highlights: ${trafficDes} \nCrime highlights: ${crimeDes}. \nBest regards, \nSafeTraveler team`,
			html: `
      <html>
  <head>
    <style>
      /* Add CSS styling here */
      body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }
      h1 {
        font-size: 24px;
        margin-top: 0;
      }
      p {
        margin-top: 0;
        margin-bottom: 16px;
      }
      .highlight {
        font-weight: bold;
        color: #458586;
      }
      .footer {
        margin-top: 32px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
      <tr>
        <td align="center" bgcolor="#458586" style="padding: 32px;">
          <img src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/providence/Summer2015_0897_c3ff51d8-a9a3-4903-ae53-0697fe21d33f.jpg" alt="SafeTraveler Logo" width="100%" height="400px" style="display: block;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" width="600">
                <tr>
                  <td bgcolor="#ffffff" style="padding: 32px;">
                    <p>Dear traveler,</p>
                    <p>This is your daily safety report for <span class="highlight">${address}</span>:</p>
                    <ul>
                      <li class="highlight">Traffic highlights:</li>
                      <ul>
                        ${traffic
													.map((t) => `<li>${t.description}</li>`)
													.join('')}
                      </ul>
                      <li class="highlight">Crime highlights:</li>
                      <ul>
                        ${crime
													.map((c) => `<li>${c.type} at ${c.address}</li>`)
													.join('')}
                      </ul>
                    </ul>
                    <p>We hope you find this information helpful and wish you a safe and enjoyable trip.</p>
                    <p>Best regards,</p>
                    <p>The SafeTraveler Team</p>
                  </td>
                </tr>
                <tr>
                  <td bgcolor="#458586" style="padding: 32px;">
                    <p class="footer" style="color: #ffffff; font-size: 12px;">This email was sent from an unmonitored address. Please do not reply.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </td>
      </tr>
    </table>
  </body>
</html>`,
		};
		sgMail
			.send(msg)
			.then(() => {
				console.log('Email sent');
			})
			.catch((error) => {
				console.error(error);
			});
	});
}

module.exports = {
	sendEmail: async () => {
		// const alertJob = schedule.scheduleJob('0 1 * * *', sendAlerts);
		await sendAlerts();
	},
};

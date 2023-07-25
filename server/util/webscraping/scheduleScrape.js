const webScrape = require('./webScrape');
const getCoordsForAddress = require('../apis/location');
const schedule = require('node-schedule');
const mapUtil = require('../map');

async function scrapeAll() {
	// Providence
	let providence = await webScrape(
		'https://data.providenceri.gov/Public-Safety/Providence-Police-Case-Log-Past-180-days/rz3y-pz8v',
		'.dataset-preview'
	);
	let crimesProvidencce = await Promise.all(
		providence.map(async (doc) => {
			if (doc.length != 0) {
				let coords = await getCoordsForAddress(doc[1] + ', Providence');
				if (coords === null) {
					return undefined;
				}
				return {
					type: doc[5],
					address: doc[1],
					date: doc[2],
					location: {
						longitude: coords.lng,
						latitude: coords.lat,
					},
				};
			}
		})
	);
	crimesProvidencce = crimesProvidencce.filter((crime) => crime !== undefined);
	//save to db
	let providenceDB = await mapUtil.createCrime(crimesProvidencce);

	// // Chicago
	let chicago = await webScrape(
		'https://data.cityofchicago.org/Public-Safety/Crimes-2023/xguy-4ndq',
		'.dataset-preview'
	);
	let crimesChicago = await Promise.all(
		chicago.map(async (doc) => {
			console.log(doc);
			if (doc.length !== 0) {
				let coords = await getCoordsForAddress(
					doc[3].substring(6) + ', Chicago'
				);
				if (coords === null) {
					return undefined;
				}
				return {
					type: doc[5],
					address: doc[3].substring(6),
					date: doc[2],
					location: {
						longitude: coords.lng,
						latitude: coords.lat,
					},
				};
			}
		})
	);
	// Remove undefined elements from array
	crimesChicago = crimesChicago.filter((crime) => crime !== undefined);
	//save crime into DB
	let chicagoDB = await mapUtil.createCrime(crimesChicago);

	return {
		Providence: providenceDB,
		Chicago: chicagoDB,
	};
}

module.exports = {
	scheduleScrape: async () => {
		await scrapeAll();
		schedule.scheduleJob('0 0 * * *', scrapeAll);
	},
};

// scrapeAll()
// 	.then((res) => {
// 		//console.log('Helluuuuuu');
// 		console.log(res);
// 	})
// 	.catch((err) => {
// 		console.log('	ERRORRRR');
// 		console.log(err);
// 	});

// 0 0 * * * /usr/local/bin/node /Users/phuongcao/Documents/VietTech/TravelSafety/server/util/webscraping/scheduleScrape.js

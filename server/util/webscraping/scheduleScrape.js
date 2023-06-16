const webScrape = require('./webScrape');

// Providence
webScrape(
	'https://data.providenceri.gov/Public-Safety/Providence-Police-Case-Log-Past-180-days/rz3y-pz8v',
	'.dataset-preview'
);

// Chicago
webScrape(
	'https://data.cityofchicago.org/Public-Safety/Crimes-2023/xguy-4ndq',
	'.dataset-preview'
);

// San Francisco
webScrape(
	'https://data.sfgov.org/Public-Safety/Law-Enforcement-Dispatched-Calls-for-Service-Real-/gnap-fj3t/data',
	'.socrata-table'
);

// 0 0 * * * /usr/local/bin/node /Users/phuongcao/Documents/VietTech/TravelSafety/server/util/webscraping/scheduleScrape.js

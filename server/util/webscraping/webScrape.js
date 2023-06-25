const puppeteer = require('puppeteer');

async function webScrape(url, cssClass) {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(url);
	const query = cssClass + ' tr';
	await page.waitForSelector(cssClass);

	// Wrap the page.evaluate() method in a function that takes the query variable as an argument
	const extractData = (query) => {
		// Select all <tr> tags inside the .dataset-preview element
		const tableRows = Array.from(document.querySelectorAll(query));

		// Extract data from the table rows
		return tableRows.map((row) => {
			const cells = Array.from(row.querySelectorAll('td'));

			// Exract the text content of each cell td within the table
			return cells.map((cell) => cell.textContent.trim());
		});
	};

	const data = await page.evaluate(extractData, query); // Pass extractData function and query variable as arguments

	await browser.close();

	return data;
}

// webScrape(
// 	'https://data.sfgov.org/Public-Safety/Law-Enforcement-Dispatched-Calls-for-Service-Real-/gnap-fj3t/data',
// 	'.socrata-table'
// )
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

module.exports = webScrape;

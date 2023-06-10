const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(
		'https://data.providenceri.gov/Public-Safety/Providence-Police-Case-Log-Past-180-days/rz3y-pz8v'
	);

	await page.waitForSelector('.dataset-preview');

	const data = await page.evaluate(() => {
		// Select all <tr> tags inside the .dataset-preview element
		const tableRows = Array.from(
			document.querySelectorAll('.dataset-preview tr')
		);

		// Extract data from the table rows
		return tableRows.map((row) => {
			const cells = Array.from(row.querySelectorAll('td'));

			// Exract the text content of each cell td within the table
			return cells.map((cell) => cell.textContent.trim());
		});
	});

	console.log(data);
	await browser.close();
})();

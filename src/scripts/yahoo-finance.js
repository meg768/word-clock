var https = require('https');

function request(url) {
	return new Promise((resolve, reject) => {
		var req = https.get(
			url,
			{
				headers: {
					Accept: 'application/json',
					'User-Agent': 'Mozilla/5.0 (compatible; word-clock/1.0)'
				}
			},
			response => {
				var body = '';

				response.setEncoding('utf8');
				response.on('data', chunk => {
					body += chunk;
				});
				response.on('end', () => {
					if (response.statusCode < 200 || response.statusCode >= 300) {
						reject(new Error('Request failed with status ' + response.statusCode));
						return;
					}

					try {
						resolve(JSON.parse(body));
					}
					catch (error) {
						reject(new Error('Invalid JSON response from Yahoo Finance'));
					}
				});
			}
		);

		req.on('error', reject);
	});
}

async function fetchQuote(symbol) {
	var url =
		'https://query1.finance.yahoo.com/v8/finance/chart/' +
		encodeURIComponent(symbol) +
		'?interval=1d&range=1d';
	var json = await request(url);
	var result = json.chart && json.chart.result && json.chart.result[0];
	var meta = result && result.meta;

	if (meta == undefined) {
		var error =
			json.chart && json.chart.error && json.chart.error.description
				? json.chart.error.description
				: 'Missing chart data';
		throw new Error(error);
	}

	var price = meta.regularMarketPrice;
	var previousClose = meta.chartPreviousClose;
	var changePercent = 0;

	if (typeof price === 'number' && typeof previousClose === 'number' && previousClose !== 0) {
		changePercent = ((price - previousClose) / previousClose) * 100;
	}

	return {
		symbol: symbol,
		regularMarketPrice: price,
		regularMarketChangePercent: changePercent
	};
}

module.exports = {
	quote: async function (symbols) {
		if (!Array.isArray(symbols)) {
			return fetchQuote(symbols);
		}

		return Promise.all(symbols.map(fetchQuote));
	}
};

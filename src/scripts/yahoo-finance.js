var yahoo = require('yahoo-finance');
var debug = require('./debug.js');

function fetchQuotes(symbols) {

	return new Promise((resolve, reject) => {
		var params = {};

		params.symbols = [];
		params.modules = ['price'];

		symbols.forEach((symbol) => {
			params.symbols.push(symbol.symbol);
		})

		debug('Fetching quotes for symbols', symbols);

		yahoo.quote(params).then((data) => {

			var results = [];

			symbols.forEach((symbol) => {
				var change = data[symbol.symbol].price.regularMarketChangePercent;
				var price = data[symbol.symbol].price.regularMarketPrice;

				results.push({...symbol, change:change, price:price});
			});

			resolve(results);
		})
		.catch((error) => {
			reject(error);
		});

	});

}

module.exports.fetchQuotes = fetchQuotes;
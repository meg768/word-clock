var yahoo = require('yahoo-finance');
var debug = require('./debug.js');

var cache = [];


function getSymbols(name, symbols, useCache) {

	if (useCache && cache[name] != undefined) {
		debug('Returning cached values for', name);
		return Promise.resolve(cache[name]);

	}

	return new Promise((resolve, reject) => {
		var params = {};

		params.symbols = [];
		params.modules = ['price'];

		symbols.forEach((symbol) => {
			params.symbols.push(symbol.symbol);
		})

		debug('Fetching symbols', symbols);

		yahoo.quote(params).then((data) => {

			var results = [];

			symbols.forEach((symbol) => {
				var change = data[symbol.symbol].price.regularMarketChangePercent;
				var price = data[symbol.symbol].price.regularMarketPrice;

				results.push({name:symbol.name, symbol:symbol.symbol, change:change, price:price});
			});

			setTimeout(() => {
				getSymbols(name, symbols, false).then(() => {
				})
				.catch((error) => {
					console.log(error);
				});

			}, 1 * 1000 * 60);


			cache[name] = results;

			resolve(results);
		})
		.catch((error) => {
			reject(error);
		});

	});

}


module.exports = class YahoooFinance {

	constructor() {
	}

	getSymbols(name, symbols) {

		return getSymbols(name, symbols, true);

		

	}
}

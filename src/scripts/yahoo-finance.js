var yahoo = require('yahoo-finance');
var Timer = require('yow/timer');

var cache = [];

module.exports = class YahoooFinance {

	constructor() {
	}

	getSymbols(name, symbols, useCache = true) {

		if (useCache && cache[name] != undefined) {
			console.log('Returning cached values for', name);
			return Promise.resolve(cache[name]);

		}

		return new Promise((resolve, reject) => {
			var params = {};

			params.symbols = [];
			params.modules = ['price'];

			symbols.forEach((symbol) => {
				params.symbols.push(symbol.symbol);
			})
	
			console.log('Fetching symbols', symbols);

			yahoo.quote(params).then((data) => {
	
				var results = [];

				symbols.forEach((symbol) => {
					var change = data[symbol.symbol].price.regularMarketChangePercent;
					var price = data[symbol.symbol].price.regularMarketPrice;

					results.push({name:symbol.name, symbol:symbol.symbol, change:change, price:price});
				});

				setTimeout(() => {
					this.getSymbols(name, symbols, false).then(() => {

					})
					.catch((error) => {
						console.log(error);
					});

				}, 15 * 1000 * 60);

				/*
				var timer = new Timer();
				// Remove from cache after a while
				timer.setTimer(30000, () => {
					this.getSymbols(name, symbols).then(() => {

					})
					.catch((error) => {
						console.log(error);
					});

					console.log('Removing cached results for', name);
					delete cache[name];

					if (cache[name] != undefined) {
						console.log('What?!');
					}
				});				
				cache[name] = {timer:timer, cache:results};
				*/

				cache[name] = results;

				console.log('Caching results for', name);
				resolve(results);
			})
			.catch((error) => {
				reject(error);
			});
	
		});

	}
}

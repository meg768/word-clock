var yahoo = require('yahoo-finance');
var Timer = require('yow/timer');

var cache = [];

module.exports = class YahoooFinance {

	constructor() {
	}

	getSymbols(name, symbols) {

		if (cache[name] != undefined) {
			console.log('Returning cached values for', name);
			return Promise.resolve(cache[name].cache);

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

				var timer = new Timer();

				// Remove from cache after a while
				timer.setTimer(30000, () => {
					console.log('Removing cached results for', name);
					delete cache[name];

					if (cache[name] != undefined) {
						console.log('What?!');
					}
				});				

				cache[name] = {timer:timer, cache:results};

				console.log('Caching results for', name);
				resolve(results);
			})
			.catch((error) => {
				reject(error);
			});
	
		});

	}
}

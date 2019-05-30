var yahoo = require('yahoo-finance');
var Timer = require('yow/timer');

var cache = [];
var timer = new Timer();


module.exports = class YahoooFinance {

	constructor() {
	}

	getSymbols(name, symbols) {

		if (cache[name] != undefined) {
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

				// Remove from cache after a while
				timer.setTimer(30000, () => {
					console.log('Removing cached results for', name);
					delete cache[name];

					if (cache[name] != undefined) {
						console.log('What?!');
					}
				});				

				console.log('Caching results for', name);
				resolve(cache[name] = results);
			})
			.catch((error) => {
				reject(error);
			});
	
		});

	}
}

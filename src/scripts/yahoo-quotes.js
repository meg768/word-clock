var yahoo = require('yahoo-finance');
var Events  = require('events');
var debug = require('./debug.js');
var schedule = require('node-schedule');


module.exports = class extends Events {

	constructor() {
		super();
		this.quotes = {};
	}

	fetchQuotes(symbols) {

		return new Promise((resolve, reject) => {
			var params = {};

			var params = {};

			params.symbols = [];
			params.modules = ['price'];
	
			symbols.forEach((symbol) => {
				params.symbols.push(symbol.symbol);
			})
	
			debug('Fetching quotes for symbols', symbols);
	
			yahoo.quote(params).then((data) => {
	
				var quotes = {};

				symbols.forEach((symbol) => {
					var change = data[symbol].price.regularMarketChangePercent;
					var price = data[symbol].price.regularMarketPrice;
	
					this.quotes[symbol] = quotes[symbol] = {change:change, price:price};
				});
	
				resolve(quotes);
			})
			.catch((error) => {
				reject(error);
			});
	
		});

	}

	subscribe(symbols) {

		var fetch = () => {
			this.fetchQuotes(symbols).then((quotes) => {
			})
			.catch((error) => {
				console.error(error);
			});
		};

		schedule.scheduleJob({second:0}, fetch);
		fetch();
	}


};




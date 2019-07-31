var yahoo = require('yahoo-finance');
var Events  = require('events');
var debug = require('./debug.js');
var schedule = require('node-schedule');


module.exports = class extends Events {

	constructor(symbols) {
		super();

		this.quotes = {};
		this.symbols = symbols;

		this.subscribe(symbols);
	}

	subscribe(symbols) {

		var fetch = () => {
			this.fetchQuotes(symbols).then((quotes) => {
			})
			.catch((error) => {
				console.error(error);
			});
		};

		schedule.scheduleJob({minute:[5, 20, 35, 50]}, fetch);
		fetch();
	}

	fetchQuotes(symbols) {

		return new Promise((resolve, reject) => {
			var params = {};

			params.symbols = [];
			params.modules = ['price'];
	
			symbols.forEach((symbol) => {
				params.symbols.push(symbol.symbol);
			})
	
			debug('Fetching quotes for symbols', symbols);
	
			yahoo.quote(params).then((data) => {
	
				symbols.forEach((symbol) => {
					var change = data[symbol.symbol].price.regularMarketChangePercent;
					var price = data[symbol.symbol].price.regularMarketPrice;
	
					this.quotes[symbol.symbol] = {change:change, price:price};
				});
	
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
	
		});

	}



};




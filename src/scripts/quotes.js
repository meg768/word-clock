var yahoo = require('yahoo-finance2').default;
var Events  = require('events');
var debug = require('./debug.js');
var schedule = require('node-schedule');


module.exports = class extends Events {

	constructor(symbols) {
		super();

		this.quotes = {};

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
			var tickers = [];

			symbols.forEach((symbol) => {
				tickers.push(symbol.symbol);
			})
	
			debug('----------------------------');
			debug('Fetching quotes for symbols', tickers.join(' '));
	
			yahoo.quote(tickers).then((data) => {
	
				debug('XX________________');
				debug(JSON.stringify(data, null, 2));
				symbols.forEach((symbol) => {
					var change = data[symbol.symbol].price.regularMarketChangePercent;
					var price = data[symbol.symbol].price.regularMarketPrice;
	
					this.quotes[symbol.symbol] = {change:change, price:price};
				});

				debug('Finished fetching quotes.');
				this.emit('quotes', this.quotes);

				resolve();
			})
			.catch((error) => {
				debug('Failed to fetch quotes.');
				reject(error);
			});
	
		});

	}



};




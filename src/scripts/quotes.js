var yahoo = require('yahoo-finance');
var Events  = require('events');
var debug = require('./debug.js');
var schedule = require('node-schedule');

var quotes = {};

module.exports = class extends Events {

	constructor() {
		this.quotes = quotes;
		this.jobs = [];
	}

	subscribe(symbols) {

		var job = schedule.scheduleJob({second:0}, () => {
			var params = {};
	
			params.symbols = symbols;
			params.modules = ['price'];
	
			debug('Fetching quotes for symbols', symbols);
	
			yahoo.quote(params).then((data) => {
	
				symbols.forEach((symbol) => {
					var change = data[symbol].price.regularMarketChangePercent;
					var price = data[symbol].price.regularMarketPrice;
	
					this.quotes[symbol] = {change:change, price:price};
				});

				this.emit('quotes', this.quotes);
			})
			.catch((error) => {
				console.error(error);
			});
		});

		this.jobs.push(job);
	}

	quote(symbol) {
		return this.quotes[symbol];
	}

	quotes() {
		return this.quotes;
	}

};




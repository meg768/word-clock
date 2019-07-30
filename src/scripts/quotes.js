var yahoo = require('yahoo-finance');
var Events  = require('events');
var debug = require('./debug.js');
var schedule = require('node-schedule');

var quotes = {};
var data = {};

module.exports = class extends Events {

	constructor() {
		super();
		this.quotes = quotes;
		this.jobs = [];
	}
/*
	subscribeX(id, fn) {

		var job = schedule.scheduleJob({second:0}, () => {
			var params = {};
	
			params.symbols = symbols;
			params.modules = ['price'];
	
			debug('Fetching quotes for symbols', symbols);
	
			fn.apply(this, arguments).then((reply) => {
				data[id] = reply;
				this.emit('data', this.reply);
			})
			.catch((error) => {
				console.error(error);
			});
		});

		this.jobs.push(job);
	}
*/

	fetchQuotes(symbols) {

		return new Promise((resolve, reject) => {
			var params = {};

			params.symbols = symbols;
			params.modules = ['price'];
	
			debug('Fetching quotes for symbols', symbols);
	
			yahoo.quote(params).then((data) => {
	
				var quotes = {};

				symbols.forEach((symbol) => {
					var change = data[symbol].price.regularMarketChangePercent;
					var price = data[symbol].price.regularMarketPrice;
	
					quotes[symbol] = {change:change, price:price};
				});
	
				resolve(quotes);
			})
			.catch((error) => {
				reject(error);
			});
	
		});

	}
	subscribe(symbols) {

		var job = schedule.scheduleJob({second:0}, () => {

			this.fetchQuotes(symbols).then((quotes) => {
				this.quotes = {...this.quotes, quotes};				
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




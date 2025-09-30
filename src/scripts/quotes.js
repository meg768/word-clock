var yahoo = require('yahoo-finance2').default;
var Events = require('events');
var debug = require('./debug.js');
var schedule = require('node-schedule');

module.exports = class extends Events {
	constructor(symbols) {
		super();

		this.quotes = {};

		this.subscribe(symbols);
	}

	subscribe(symbols) {
		let fetch = async () => {
			await this.fetchQuotes(symbols);
		};

		schedule.scheduleJob({ minute: [5, 20, 35, 50] }, fetch);
		fetch();
	}

	async fetchQuotes(symbols) {
		var tickers = [];

		symbols.forEach(symbol => {
			tickers.push(symbol.symbol);
		});

		debug('----------------------------');
		debug('Fetching quotes for symbols', tickers.join(' '));

		let data = await yahoo.quote(tickers);

		data.forEach(item => {
			debug(item.symbol, item.regularMarketChangePercent, item.regularMarketPrice);
			this.quotes[item.symbol] = { change: item.regularMarketChangePercent, price: item.regularMarketPrice };
		});

		debug('Finished fetching quotes.');
		this.emit('quotes', this.quotes);
	}
};

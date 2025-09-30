var YahooFinance = require('yahoo-finance2');

const silentLogger = {
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {},
	log: () => {}
};

const yf = new YahooFinance({ logger: silentLogger });


module.exports = yf;

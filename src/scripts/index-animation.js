var Animation = require('./yahoo-animation.js');
var debug = require('./debug.js');
var cache = {};

module.exports = class Module extends Animation {

	constructor(options) {
		super({name:'Yahoo Index Animation', ...options});

		this.quotes = cache;
		this.symbols = [
			{name:'OMX', symbol:'^OMX'},
			{name:'NASDAQ', symbol:'^IXIC'},
			{name:'DAX', symbol:'^GDAXI'},
			{name:'DOWJONES', symbol:'^DJI'},
			{name:'HANGSENG', symbol:'^HSI'},
			{name:'USA', symbol:'^GSPC'},
			{name:'UK', symbol:'^FTSE'},
			{name:'BRIC', symbol:'^BSESN'},
			{name:'NIKKEI', symbol:'^N225'}
		];
	
		this.on('quotes', (quotes) => {
			debug('Got index quotes...');
		});

		this.fetchQuotes();
	}


};
var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var yahoo = require('./yahoo-finance.js')

var fetchQuotes = cached(1000 * 60 * 15, (symbols) => { 
	return yahoo.fetchQuotes(symbols);
});


module.exports = class Module extends Animation {

	constructor(options) {
		super({...options, name:'Yahoo Index Animation'});
	}

	fetchQuotes() {
		var symbols = [
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

		return fetchQuotes(symbols);
	}



};

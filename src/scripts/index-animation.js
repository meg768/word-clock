var Animation = require('./yahoo-animation.js');

var quotes = [
	{name:'OMX', symbol:'^OMX', change:0.5},
	{name:'NASDAQ', symbol:'^IXIC'},
	{name:'DAX', symbol:'^GDAXI'},
	{name:'DOWJONES', symbol:'^DJI'},
	{name:'HANGSENG', symbol:'^HSI'},
	{name:'USA', symbol:'^GSPC'},
	{name:'UK', symbol:'^FTSE'},
	{name:'BRIC', symbol:'^BSESN'},
	{name:'NIKKEI', symbol:'^N225'}
];

module.exports = class Module extends Animation {

	constructor(options) {
		super({name:'Yahoo Index Animation', ...options});
	}

	getQuotes() {
		return quotes;
	}

};
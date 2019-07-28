var Animation = require('./word-animation.js');
var yahoo = require('./yahoo-finance.js')

var quotes = [
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

module.exports = class Module extends Animation {

	constructor(options) {
		super({name:'Yahoo Index Animation', ...options});
	}

	start() {
		return super.start();
	}

	getWords() {
		var words = [];

		quotes.forEach((item) => {
			words.push({word:item.name, color:'white'});
		});

		return words;
		
	}

};

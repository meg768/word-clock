var Animation = require('./yahoo-animation.js');
var debug = require('./debug.js');

var quotes = {}, symbols = [
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
		super({name:'Yahoo Index Animation', quotes:quotes, symbols:symbols, ...options});
	}


};
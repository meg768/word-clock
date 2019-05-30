var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var Yahoo = require('./yahoo-finance.js')

var fetchIndices = function(yahoo) {

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

	var yahoo = new Yahoo();

	return yahoo.fetchQuotes(symbols);
}

var getIndices = cached(fetchIndices, 60000);

module.exports = class Module extends Animation {

	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Yahoo Index Animation';
	}

	static fetchQuotes() {
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

		var yahoo = new Yahoo();
		return yahoo.fetchQuotes(symbols);
	}

	static foo = 4;

	getQuotes() {
		return getIndices(this.yahoo);
		return ([
			{name:'OMX', symbol:'^OMX'},
			{name:'NASDAQ', symbol:'^IXIC'},
			{name:'DAX', symbol:'^GDAXI'},
			{name:'DOWJONES', symbol:'^DJI'},
			{name:'HANGSENG', symbol:'^HSI'},
			{name:'USA', symbol:'^GSPC'},
			{name:'UK', symbol:'^FTSE'},
			{name:'BRIC', symbol:'^BSESN'},
			{name:'NIKKEI', symbol:'^N225'}
		]);

	}



};

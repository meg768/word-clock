#!/usr/bin/env node


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {
		var Quotes = require('../scripts/quotes.js');

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
		
		var quotes = new Quotes(symbols);

		quotes.on('quotes', (quotes) => {
			console.log(quotes);
		});


	}


	module.exports.command  = 'quotes [options]';
	module.exports.describe = 'Test Quotes';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

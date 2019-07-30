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
		var Quotes = require('./quotes.js');
		var quotes = new Quotes();
		var symbols = ['^OMX', '^IXIC', '^GDAXI'];
		quotes.subscribe(symbols);

		quotes.on('quotes', (quotes) => {
			console.log(quotes);
		});


	}


	module.exports.command  = 'quotes [options]';
	module.exports.describe = 'Test Quotes';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

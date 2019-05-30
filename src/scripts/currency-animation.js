var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var yahoo = require('./yahoo-finance.js')

var fetchQuotes = cached(60000, (symbols) => { 
	return yahoo.fetchQuotes(symbols);
});

module.exports = class Module extends Animation {

	constructor(options) {
		super({...options, name:'Yahoo Currency Animation'});
	}


	fetchQuotes() {
		var symbols = [
			{name:'NOK', symbol:'NOKSEK=X'},
			{name:'JPY', symbol:'JPYSEK=X'},
			{name:'USD', symbol:'USDSEK=X'},
			{name:'GBP', symbol:'GBPSEK=X'},
			{name:'EUR', symbol:'EURSEK=X'},
			{name:'DKK', symbol:'DKKSEK=X'},
			{name:'CAD', symbol:'CADSEK=X'}
		
		];

		return fetchQuotes(symbols);
	}



};

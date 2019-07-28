var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var yahoo = require('./yahoo-finance.js')

var fetchQuotes = cached(1000 * 60 * 15, (symbols) => { 
	return yahoo.fetchQuotes(symbols);
});


module.exports = class Module extends Animation {

	constructor(options) {
		super({name:'Yahoo Currency Animation', ...options});
	}

	getSymbols() {
		var symbols = [
			{name:'NOK', symbol:'NOKSEK=X'},
			{name:'JPY', symbol:'JPYSEK=X'},
			{name:'USD', symbol:'USDSEK=X'},
			{name:'GBP', symbol:'GBPSEK=X'},
			{name:'EUR', symbol:'EURSEK=X'},
			{name:'DKK', symbol:'DKKSEK=X'},
			{name:'CAD', symbol:'CADSEK=X'}
		
		];

		return symbols;

	}

	fetchQuotes() {
		return fetchQuotes(this.getSymbols());
	}



};

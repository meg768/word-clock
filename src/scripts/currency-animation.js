var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var yahoo = require('./yahoo-finance.js')

var fetchQuotes = cached(() => {
	var symbols = [
		{name:'NOK', symbol:'NOKSEK=X'},
		{name:'JPY', symbol:'JPYSEK=X'},
		{name:'USD', symbol:'USDSEK=X'},
		{name:'GBP', symbol:'GBPSEK=X'},
		{name:'EUR', symbol:'EURSEK=X'},
		{name:'DKK', symbol:'DKKSEK=X'},
		{name:'CAD', symbol:'CADSEK=X'}
	];

	return yahoo.fetchQuotes(symbols);

}, 60000);


module.exports = class extends Animation {

	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Yahoo Currency';
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

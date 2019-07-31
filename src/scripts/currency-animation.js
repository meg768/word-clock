var Animation = require('./yahoo-animation.js');
var Quotes = require('./yahoo-quotes.js');

var quotes = new Quotes([
	{name:'NOK', symbol:'NOKSEK=X'},
	{name:'JPY', symbol:'JPYSEK=X'},
	{name:'USD', symbol:'USDSEK=X'},
	{name:'GBP', symbol:'GBPSEK=X'},
	{name:'EUR', symbol:'EURSEK=X'},
	{name:'DKK', symbol:'DKKSEK=X'},
	{name:'CAD', symbol:'CADSEK=X'}
]);

module.exports = class Module extends Animation {

	constructor(options) {		
		super({name:'Yahoo Currency Animation', quotes:quotes, ...options});
	}

};


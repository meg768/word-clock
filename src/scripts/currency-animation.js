var Animation = require('./yahoo-animation.js');
var debug = require('./debug.js');

var quotes = {}, symbols = [
	{name:'NOK', symbol:'NOKSEK=X'},
	{name:'JPY', symbol:'JPYSEK=X'},
	{name:'USD', symbol:'USDSEK=X'},
	{name:'GBP', symbol:'GBPSEK=X'},
	{name:'EUR', symbol:'EURSEK=X'},
	{name:'DKK', symbol:'DKKSEK=X'},
	{name:'CAD', symbol:'CADSEK=X'}
];

module.exports = class Module extends Animation {

	constructor(options) {
		super({name:'Yahoo Currency Animation', quotes:quotes, symbols:symbols, ...options});
	}


};
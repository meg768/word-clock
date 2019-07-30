var Animation = require('./yahoo-animation.js');

module.exports = class Module extends Animation {

	constructor(options) {
		var symbols = [
			{name:'NOK', symbol:'NOKSEK=X'},
			{name:'JPY', symbol:'JPYSEK=X'},
			{name:'USD', symbol:'USDSEK=X'},
			{name:'GBP', symbol:'GBPSEK=X'},
			{name:'EUR', symbol:'EURSEK=X'},
			{name:'DKK', symbol:'DKKSEK=X'},
			{name:'CAD', symbol:'CADSEK=X'}
		];
		
		super({name:'Yahoo Currency Animation', symbols:symbols, ...options});
	}


};
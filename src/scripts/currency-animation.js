var Animation = require('./yahoo-animation.js');

module.exports = class extends Animation {

	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Yahoo Currency';
	}

	getSymbols() {
		return ([
			{name:'NOK', symbol:'NOKSEK=X'},
			{name:'JPY', symbol:'JPYSEK=X'},
			{name:'USD', symbol:'USDSEK=X'},
			{name:'GBP', symbol:'GBPSEK=X'},
			{name:'EUR', symbol:'EURSEK=X'},
			{name:'DKK', symbol:'DKKSEK=X'},
			{name:'CAD', symbol:'CADSEK=X'}
		]);

	}



};

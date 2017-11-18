var AvanzaAnimation = require('./avanza-animation.js');

module.exports = class extends AvanzaAnimation {


	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Avanza Currency';
	}

	getSymbols() {
		return ([
			{symbol: 'NOK', id:53293},
			{symbol: 'JPY', id:108702},
			{symbol: 'USD', id:19000},
			{symbol: 'GBP', id:108703},
			{symbol: 'EUR', id:18998},
			{symbol: 'DKK', id:53292},
			{symbol: 'CAD', id:108701}
		]);

	}



};

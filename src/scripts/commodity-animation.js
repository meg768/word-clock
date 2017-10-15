var AvanzaAnimation = require('./avanza-animation.js');

module.exports = class extends AvanzaAnimation {


	constructor(strip, options) {
		super(strip, options);

		this.name = 'Avanza Commodity';
	}

	getSymbols() {
		return ([
			{symbol: 'ZN',    id:18992},
			{symbol: 'AU',    id:18986},
			{symbol: 'AL',    id:18990},
			{symbol: 'NI',    id:18996},
			{symbol: 'CU',    id:18989},
			{symbol: 'BRENT', id:155722},
			{symbol: 'AG',    id:18991},
			{symbol: 'PB',    id:18983}
		]);

	}



};

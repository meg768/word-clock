var Animation = require('./yahoo-animation.js');

module.exports = class extends Animation {

	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Yahoo Commodity';
	}

	getSymbols() {
		return ([
			{name:'ZN', symbol:'^SPGSIZ'}, // Zink 
			{name:'AU', symbol:'^SPGSGC'}, // Guld 
			{name:'AL', symbol:'^SPGSIA'}, // Aluminium 
			{name:'NI', symbol:'^SPGSIK'}, // Nickel 
			{name:'CU', symbol:'^SPGSIC'}, // Koppar 
			{name:'BRENT', symbol:'^SPGSBR'}, // Olja  
			{name:'AG', symbol:'^SPGSSI'}, // Silver 
			{name:'PB', symbol:'^SPGSIL'} // Bly 
		]);

	}



};

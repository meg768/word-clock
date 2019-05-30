var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var yahoo = require('./yahoo-finance.js')

var fetchQuotes = cached((symbols) => { 
	return yahoo.fetchQuotes(symbols);
}, 60000);

module.exports = class Module extends Animation {

	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Yahoo Commodity Animation';
	}


	fetchQuotes() {
		var symbols = [
			{name:'ZN', symbol:'^SPGSIZ'}, // Zink 
			{name:'AU', symbol:'^SPGSGC'}, // Guld 
			{name:'AL', symbol:'^SPGSIA'}, // Aluminium 
			{name:'NI', symbol:'^SPGSIK'}, // Nickel 
			{name:'CU', symbol:'^SPGSIC'}, // Koppar 
			{name:'BRENT', symbol:'^SPGSBR'}, // Olja  
			{name:'AG', symbol:'^SPGSSI'}, // Silver 
			{name:'PB', symbol:'^SPGSIL'} // Bly 
		
		];

		return fetchQuotes(symbols);
	}



};

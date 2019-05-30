var Animation = require('./yahoo-animation.js');
var cached = require('./cached.js');
var yahoo = require('./yahoo-finance.js')

var fetchQuotes = cached(1000 * 60 * 15, (symbols) => { 
	return yahoo.fetchQuotes(symbols);
});

module.exports = class Module extends Animation {

	constructor(options) {
		super({name:'Yahoo Commodity Animation', ...options});
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

var Animation = require('./yahoo-animation.js');
var Quotes = require('./yahoo-quotes.js');

var quotes = new Quotes([
	{name:'ZN', symbol:'^SPGSIZ'}, // Zink 
	{name:'AU', symbol:'^SPGSGC'}, // Guld 
	{name:'AL', symbol:'^SPGSIA'}, // Aluminium 
	{name:'NI', symbol:'^SPGSIK'}, // Nickel 
	{name:'CU', symbol:'^SPGSIC'}, // Koppar 
	{name:'BRENT', symbol:'^SPGSBR'}, // Olja  
	{name:'AG', symbol:'^SPGSSI'}, // Silver 
	{name:'PB', symbol:'^SPGSIL'} // Bly 
]);

module.exports = class Module extends Animation {

	constructor(options) {		
		super({name:'Yahoo Commodity Animation', quotes:quotes, ...options});
	}

};


var Animation = require('./quote-animation.js');

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

module.exports = class Module extends Animation {

	constructor(options) {		
		super({name:'Yahoo Commodity Animation', symbols:symbols, ...options});
	}

};


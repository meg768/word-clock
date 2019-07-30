var Animation = require('./yahoo-animation.js');
var debug = require('./debug.js');


module.exports = class Module extends Animation {

	constructor(options) {

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
		
		super({name:'Yahoo Commodity Animation', symbols:symbols, ...options});
	}


};
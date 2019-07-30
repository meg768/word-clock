var Animation = require('./yahoo-animation.js');
var debug = require('./debug.js');

var quotes = {}, symbols = [
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
		super({name:'Yahoo Commodity Animation', quotes:quotes, symbols:symbols, ...options});
	}


};
#!/usr/bin/env node


var YahoooFinance = require('./src/scripts/yahoo-finance.js');

var App = function() {


	function run() {

		var yahoo = new YahoooFinance();
		
		var indicies = [
			{name:'OMX', symbol:'^OMX'},
			{name:'NASDAQ', symbol:'^IXIC'},
			{name:'DAX', symbol:'^GDAXI'},
			{name:'DOWJONES', symbol:'^DJI'},
			{name:'HANGSENG', symbol:'^HSI'},
			{name:'USA', symbol:'^GSPC'},
			{name:'UK', symbol:'^FTSE'},
			{name:'BRIC', symbol:'^BSESN'},
			{name:'NIKKEI', symbol:'^N225'}
		];

		var currencies = [
			{name:'NOK', symbol:'NOKSEK=X'},
			{name:'JPY', symbol:'JPYSEK=X'},
			{name:'USD', symbol:'USDSEK=X'},
			{name:'GBP', symbol:'GBPSEK=X'},
			{name:'EUR', symbol:'EURSEK=X'},
			{name:'DKK', symbol:'DKKSEK=X'},
			{name:'CAD', symbol:'CADSEK=X'}
		];

		var commodities = [
			{name:'ZN', symbol:'^SPGSIZ'}, // Zink 
			{name:'AU', symbol:'^SPGSGC'}, // Guld 
			{name:'AL', symbol:'^SPGSIA'}, // Aluminium 
			{name:'NI', symbol:'^SPGSIK'}, // Nickel 
			{name:'CU', symbol:'^SPGSIC'}, // Koppar 
			{name:'BRENT', symbol:'^SPGSBR'}, // Olja  
			{name:'AG', symbol:'^SPGSSI'}, // Silver 
			{name:'PB', symbol:'^SPGSIL'} // Bly ^SPGSBR
		];

		yahoo.getSymbols(commodities).then((data) => {
			console.log(data);
		})
		.catch((error) => {
			console.log(error);
		});


	};

	run();
};

var app = new App();

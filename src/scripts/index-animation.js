var Animation = require('./yahoo-animation.js');

module.exports = class extends Animation {

	constructor(pixels, options) {
		super(pixels, options);

		this.name = 'Yahoo Index Animation';
	}

	getSymbols() {
		return ([
			{name:'OMX', symbol:'^OMX'},
			{name:'NASDAQ', symbol:'^IXIC'},
			{name:'DAX', symbol:'^GDAXI'},
			{name:'DOWJONES', symbol:'^DJI'},
			{name:'HANGSENG', symbol:'^HSI'},
			{name:'USA', symbol:'^GSPC'},
			{name:'UK', symbol:'^FTSE'},
			{name:'BRIC', symbol:'^BSESN'},
			{name:'NIKKEI', symbol:'^N225'}
		]);

	}



};

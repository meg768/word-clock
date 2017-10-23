var AvanzaAnimation = require('./avanza-animation.js');


module.exports = class extends AvanzaAnimation {


	constructor(strip, options) {
		super(strip, options);

		this.name = 'Avanza Index Animation';
	}

	getSymbols() {
		return ([
			{symbol: 'OMX',      id:19002},
			{symbol: 'NASDAQ',   id:19006},
			{symbol: 'DAX',      id:18981},
			{symbol: 'DOWJONES', id:18985},
			{symbol: 'HANGSENG', id:18984},
			{symbol: 'USA',      id:155458},
			{symbol: 'UK',       id:155698},
			{symbol: 'BRIC',     id:134948},
			{symbol: 'NIKKEI',   id:18997}
		]);

	}



};

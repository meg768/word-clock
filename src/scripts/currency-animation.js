var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var Colors     = require('color-convert');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('./avanza.js');
var Animation  = require('./animation.js');
var AvanzaAnimation  = require('./avanza-animation.js');
var Layout     = require('./layout.js');
var Pixels     = require('./pixels.js');
var Color      = require('color');

module.exports = class extends AvanzaAnimation {


	constructor(strip, options) {
		super(strip, options);

		this.name    = 'Avanza Currency';

		this.symbols = ([
			{symbol: 'NOK', id:53293},
			{symbol: 'JPY', id:108702},
			{symbol: 'USD', id:19000},
			{symbol: 'GBP', id:108703},
			{symbol: 'EUR', id:18998},
			{symbol: 'DKK', id:53292},
			{symbol: 'CAD', id:108701}
		]);

	}



};

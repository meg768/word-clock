var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var Colors     = require('color-convert');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('./avanza.js');
var Animation  = require('./animation.js');
var Layout     = require('./layout.js');
var Pixels     = require('./pixels.js');
var Color      = require('color');

module.exports = class extends Animation {


	constructor(strip, options) {
		super(strip, options);

		this.name      = 'Avanza';
		this.avanza    = new Avanza();

		this.textProviderIndex  = 0;
		this.textProviders      = [this.getRavaror, this.getIndex, this.getCurrency];

	}




	getIndex() {

		return this.avanza.getMarket([
			{symbol: 'OMX',      id:155585}, // ??
			{symbol: 'NASDAQ',   id:19006},
			{symbol: 'DAX',      id:18981},
			{symbol: 'DOWJONES', id:155667}, // ??
			{symbol: 'HANGSENG', id:18984},
			{symbol: 'USA',      id:155458},
			{symbol: 'UK',       id:155698},
			{symbol: 'BRIC',     id:134948},
			{symbol: 'NIKKEI',   id:18997}
		]);
	}

	getCurrency() {

		return this.avanza.getMarket([
			{symbol: 'NOK', id:53293},
			{symbol: 'JPY', id:108702},
			{symbol: 'USD', id:19000},
			{symbol: 'GBP', id:108703},
			{symbol: 'EUR', id:18998},
			{symbol: 'DKK', id:53292},
			{symbol: 'CAD', id:108701}
		]);
	}

	getRavaror() {
		return this.avanza.getMarket([
			{symbol: 'ZN',    id:18992},
			{symbol: 'AU',    id:18986},
			{symbol: 'AL',    id:18990},
			{symbol: 'NI',    id:18996},
			{symbol: 'CU',    id:18989},
			{symbol: 'BRENT', id:155722},
			{symbol: 'AG',    id:18991},
			{symbol: 'PB',    id:18983}
		]);

	}

	getSymbols() {
		var self = this;
		var avanza = self.avanza;

		return new Promise(function(resolve, reject) {

			var provider = self.textProviders[self.textProviderIndex++ % self.textProviders.length];
			var caller = provider.bind(self);

			caller.then(function(data) {
				resolve(data);
			})
			.catch(function(error) {
				reject(error)
			})

		});
	}

	displaySymbols(symbols) {
		var self    = this;
        var pixels  = new Pixels(this.strip.width, this.strip.height);
        var display = new Layout();
		var words   = [];

		symbols.forEach(function(symbol) {
			words.push(symbol.symbol);
		});

        var lookup = display.lookupText(words.join(' '));

		if (lookup.length == symbols.length) {
			pixels.clear();

			for (var index = 0; index < symbols.length; index++) {
				var symbol = symbols[index];
				var layout = lookup[index];

				for (var i = 0; i < layout.text.length; i++) {
	                pixels.setPixel(layout.x + i, layout.y, Color(symbol.color).rgbNumber());
	            }

			}

	        self.strip.render(pixels.getPixels(), {fadeIn:10});

		}
		else {
			pixels.fillRGB(255, 0, 0);
			self.strip.render(pixels.getPixels(), {fadeIn:10});

		}

    }


	start() {

        return new Promise((resolve, reject) => {

			super.start().then(() => {
				return this.getSymbols();
			})
			.then((symbols) => {
				this.displaySymbols(symbols);
				resolve();
			})
            .catch((error) => {
                reject(error);
            });
        });
    }


};

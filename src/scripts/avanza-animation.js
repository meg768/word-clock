var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var Colors     = require('color-convert');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('avanza-mobile-client');
var Animation  = require('./animation.js');
var Layout     = require('./layout.js');
var Pixels     = require('./pixels.js');
var Color      = require('color');

module.exports = class extends Animation {


	constructor(strip) {
		super(strip);

		this.name      = 'Avanza';
		this.lastLogin = undefined;
		this.avanza    = new Avanza();
		this.cache     = {};

		this.textProviderIndex  = 0;
		this.textProviders      = [this.getRavaror, this.getIndex, this.getCurrency];

	}


	login() {

		var self = this;
		var avanza = self.avanza;

		// May we use cached weather?
        if (self.lastLogin != undefined) {
			var now = new Date();

            if (now.getTime() - self.lastLogin.getTime() < 60 * 60 * 1000) {
				console.log('Already logged in.');
                return Promise.resolve();
            }
        }


		if (avanza.session.username != undefined)
			return Promise.resolve();

		return new Promise(function(resolve, reject) {

			console.log('Logging in to Avanza...');

			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			avanza.login(credentials).then(function() {
				console.log('Avanza login OK.');
				self.lastLogin = new Date();
				resolve();
			})
			.catch(function(error) {
				reject(error);
			})

		})
	}

	getMarketIndex(id) {
		var self = this;
		var avanza = self.avanza;

		return new Promise(function(resolve, reject) {
			avanza.get(sprintf('/_mobile/market/index/%s', id)).then(function(result) {
				resolve(result);
			})
			.catch(function(error) {
				reject(error);
			});
		})

	}

	getMarket(symbols) {

		var self = this;
		var avanza = self.avanza;

		return new Promise(function(resolve, reject) {

			var promise = Promise.resolve();
			var words = [];

			symbols.forEach(function(symbol) {
				promise = promise.then(function() {
					return self.getMarketIndex(symbol.id);
				});

				promise = promise.then(function(result) {
					var word = {};
					word.symbol = symbol.symbol;
					word.color = result.changePercent < 0 ? 'red' : 'blue';
					words.push(word);
				});

			});

			promise.then(function() {
				resolve(words);
			})
			.catch(function(error) {
				reject(error);
			})
		})


	}


	getIndex() {

		return this.getMarket([
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

		return this.getMarket([
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
		return this.getMarket([
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

			self.login().then(function() {
				var provider = self.textProviders[self.textProviderIndex++ % self.textProviders.length];
				return provider.bind(self)();
			})
			.then(function(text) {
				resolve(text);
			})
			.catch(function(error) {
				reject(error)
			})

		});
	}

	displaySymbols(symbols) {
        var pixels  = new Pixels(this.strip.width, this.strip.height);
        var display = new Layout();
		var words   = [];

		symbols.forEach((symbol) => {
			words.push(symbol.text);
		});

        var lookup = display.lookupText(words.join(' '));

		pixels.clear();
		this.strip.render(pixels.getPixels(), {fadeIn:25});

		console.log('lookup', lookup);
		console.log('symbols', symbols);
		
		if (lookup.length == symbols.length) {
			for (var index = 0; index < symbols.length; index++) {
				var symbol = symbols[index];
				var layout = lookup[index];

				for (var i = 0; i < layout.text.length; i++) {
	                pixels.setPixel(layout.x + i, layout.y, Color(symbol.color).rgbNumber());
	            }

			}

	        this.strip.render(pixels.getPixels(), {fadeIn:25});

		}

    }

	run() {
		var self = this;
		var avanza = self.avanza;

        return new Promise((resolve, reject) => {

            this.getSymbols().then((symbols) => {
                this.displaySymbols(symbols);
				setTimeout(resolve, 10000);
            })

            .catch(function(error) {
                reject(error);
            });
        });
    }


};

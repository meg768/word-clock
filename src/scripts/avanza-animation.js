var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var Colors     = require('color-convert');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('avanza-mobile-client');
var Animation  = require('./animation.js');


module.exports = class extends Animation {


	constructor(display) {
		super(display);

		this.lastLogin = undefined;
		this.avanza    = new Avanza();
		this.cache     = {};

		this.textProviderIndex  = 0;
		this.textProviders      = [this.getIndexText, this.getCurrencyText];

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

	getMarketText(symbols) {

		var self = this;
		var avanza = self.avanza;

		return new Promise(function(resolve, reject) {

			var promise = Promise.resolve();
			var words = [];

			symbols.forEach(function(symbol) {
				promise = promise.then(function() {
					console.log('Getting currency', symbol.text);
					return self.getMarketIndex(symbol.id);
				});

				promise = promise.then(function(result) {
					console.log(symbol.text, result.changePercent);
					var word = {};
					word.text = symbol.text;
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


	getIndexText() {

		return this.getMarketText([
			{text: 'OMX',      id:155585}, // ??
			{text: 'NASDAQ',   id:19006},
			{text: 'DAX',      id:18981},
			{text: 'DOWJONES', id:155667}, // ??
			{text: 'HANGSENG', id:18984},
			{text: 'USA',      id:155458},
			{text: 'UK',       id:155698},
			{text: 'BRIC',     id:134948},
			{text: 'NIKKEI',   id:18997}
		]);
	}

	getCurrencyText() {

		return this.getMarketText([
			{text: 'NOK', id:53293},
			{text: 'JPY', id:108702},
			{text: 'USD', id:19000},
			{text: 'GBP', id:108703},
			{text: 'EUR', id:18998},
			{text: 'DKK', id:53292},
			{text: 'CAD', id:108701}
		]);
	}

	getText() {
		var self = this;
		var avanza = self.avanza;

		return new Promise(function(resolve, reject) {

			self.login().then(function() {
				var provider = self.textProviders[self.textProviderIndex++ % self.textProviders.length];
				return self.provider();
			})
			.then(function(text) {
				resolve(text);
			})
			.catch(function(error) {
				reject(error)
			})

		});
	}


	run() {
		var self = this;
		var avanza = self.avanza;

        return new Promise(function(resolve, reject) {
            self.getText().then(function(words) {
                return self.displayText(words);
            })
            .then(function() {
                resolve();
            })
            .catch(function(error) {
                reject(error);
            });
        });
    }


};

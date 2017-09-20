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

		var currency = {
			'JPY': 108702,
			'USD': 19000,
			'CAD': 108701,
			'GBP': 108703,
			'NOK': 53293,
			'DKK': 53292,
			'EUR': 18998
/*
			'NIKKEI': 18997,
			'OMX': 155585,
			'HANGSENG': 18984
			'DOWJONES': 3
			*/
		};
	}

	login() {

		var self = this;
		var avanza = self.avanza;

		if (avanza.session.username != undefined)
			return Promise.resolve();

		return new Promise(function(resolve, reject) {

			console.log('Logging in to Avanza...');

			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			avanza.login(credentials).then(function() {
				console.log('Login OK');
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

	getCurrencyText() {

		return this.getMarketText([
			{text: 'NOK', id:53293},
			{text: 'JPY', id:108702},
			{text: 'USD', id:19000},
			{text: 'GBP', id:108703},
			{text: 'EUR', id:18998},
			{text: 'DKK', id:53292},
			{text: 'CAD', id:108701},
		]);
	}

	getCurrencyTextXX() {



		var self = this;
		var avanza = self.avanza;
		var currencies = "NOK JPY USD GBP EUR DKK CAD".split(' ');

		return new Promise(function(resolve, reject) {

			var promise = Promise.resolve();
			var words = [];

			currencies.forEach(function(currency) {
				promise = promise.then(function() {
					console.log('Getting currency', currency);
					return self.getMarketIndex(id[currency])
				});

				promise = promise.then(function(result) {
					console.log(currency, result.changePercent);
					var word = {};
					word.text = currency;
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

	getText() {
		var self = this;
		var avanza = self.avanza;

		return new Promise(function(resolve, reject) {

			self.login().then(function() {
				return self.getCurrencyText();
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

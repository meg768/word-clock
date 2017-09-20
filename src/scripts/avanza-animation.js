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

			console.log('Loggin in to Avanza...');

			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			avanza.login(credentials).then(function() {
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
				resolve({name:result.name, price:result.lastPrice, change:result.changePercent});
			})
			.catch(function(error) {
				reject(error);
			});
		})

	}

	function getCurrencyText() {

		var id = {
			'JPY': 108702,
			'USD': 19000,
			'CAD': 108701,
			'GBP': 108703,
			'NOK': 53293,
			'DKK': 53292,
			'EUR': 18998
		};

		var self = this;
		var avanza = self.avanza;
		var currencies = "NOK JPY USD GBP EUR DKK CAD".split(' ');

		return new Promise(function(resolve, reject) {

			var promise = Promise.resolve();
			var words = [];

			currencies.forEach(function(currency) {
				promise = promise.then(function() {
					self.getMarketIndex(id[currency]).then(function(price) {
						var word = {};
						word.text = currency;
						word.color = price.changePercent < 0 ? 'red' : 'blue';
						words.push(word);

					})
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

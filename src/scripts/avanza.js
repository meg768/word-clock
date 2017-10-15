var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('avanza-mobile-client');

module.exports = class AvanzaCache {


	constructor() {

		this.lastLogin = undefined;
		this.avanza    = new Avanza();
		this.cache     = {};


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


		return new Promise((resolve, reject) => {

			this.login().then(() => {
				var promise = Promise.resolve();
				var result  = [];

				symbols.forEach((symbol) => {
					promise = promise.then(() => {
						return this.getMarketIndex(symbol.id);
					});

					promise = promise.then((data) => {
						result.push({symbol:symbol.symbol, change:parseFloat(data.changePercent)});
					});

				});

				return result;

			})

			.then((result) => {
				resolve(result);
			})
			.catch((error) =>  {
				reject(error);
			})
		})


	}



};

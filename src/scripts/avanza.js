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
		this.timeout   = 60 * 60 * 1000;

	}


	login() {

        if (this.lastLogin != undefined) {
			var now = new Date();

            if (now.getTime() - this.lastLogin.getTime() < this.timeout) {
                return Promise.resolve();
            }
        }


		if (this.avanza.session.username != undefined)
			return Promise.resolve();

		return new Promise((resolve, reject) => {

			console.log('Logging in to Avanza...');

			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			this.avanza.login(credentials).then(function() {
				console.log('Avanza login OK.');

				this.lastLogin = new Date();
				this.cache     = {};

				resolve();
			})
			.catch((error) => {
				reject(error);
			})

		})
	}

	getMarketIndex(id) {

		return new Promise((resolve, reject) => {
			if (this.cache[id] != undefined)
				resolve(this.cache[id]);
			else {
				this.avanza.get(sprintf('/_mobile/market/index/%s', id)).then((result) => {

					this.cache[id] = result;

					resolve(result);
				})
				.catch((error) => {
					reject(error);
				});

			}


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

				promise.then(() => {
					resolve(result);

				});
			})

			.catch((error) =>  {
				reject(error);
			})
		})


	}



};

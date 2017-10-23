var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('avanza-mobile-client');

module.exports = class AvanzaCache {


	constructor() {

		this.loginTime = undefined;
		this.cacheTime = undefined;
		this.avanza    = new Avanza();
		this.cache     = {};
	}


	login() {


        if (this.loginTime != undefined) {
			var now = new Date();

            if (now.getTime() - this.loginTime.getTime() < 60 * 60 * 1000) {
                return Promise.resolve();
            }
        }

		if (this.avanza.session.username != undefined)
			return Promise.resolve();

		return new Promise((resolve, reject) => {

			console.log('Logging in to Avanza...');

			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			this.avanza.login(credentials).then(() => {
				console.log('Avanza login OK.');

				this.loginTime = new Date();

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
				var now     = new Date();

				// Time to clear cache?
	            if (this.cacheTime == undefined || now.getTime() - this.cacheTime.getTime() > 3 * 60 * 1000) {
					console.log('Clearing cache...');
	                this.cache = {};
					this.cacheTime = now;
	            }


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

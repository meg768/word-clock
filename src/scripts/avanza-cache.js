var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('avanza-mobile-client');

function debug() {
	console.log.apply(this, arguments);
}


module.exports = class AvanzaCache {


	constructor() {

		debug('New Avanza cache!');
		this.loginTime = undefined;
		this.cacheTime = undefined;
		this.avanza    = new Avanza();
		this.cache     = {};
	}


	login() {

		debug('Logging in!');

        if (this.loginTime != undefined) {
			var now = new Date();

            if (now.getTime() - this.loginTime.getTime() < 60 * 60 * 1000) {
                return Promise.resolve();
            }
        }

		if (this.avanza.session.username != undefined)
			return Promise.resolve();

		return new Promise((resolve, reject) => {

			debug('Logging in to Avanza...');

			var credentials = {username: process.env.AVANZA_USERNAME, password:process.env.AVANZA_PASSWORD};

			this.avanza.login(credentials).then(() => {
				debug('Avanza login OK.');

				this.loginTime = new Date();

				resolve();
			})
			.catch((error) => {
				debug('***************************');
				debug(error.stack);
				debug('**************************');
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
				var open    = new Date();

				open.setHours(9);
				open.setMinutes(0);
				open.setSeconds(0);
				open.setMilliseconds(0);

				// Clear cache if not fetched data since opening or if cached data is older than some amount of time
				// Ignor day of week...
	            if (this.cacheTime == undefined || (this.cacheTime.getTime() <= open.getTime() && open.getTime() <= now.getTime()) || (now.getTime() - this.cacheTime.getTime() > 15 * 60 * 1000)) {
					debug('Clearing Avanza cache...');
	                this.cache = {};
					this.cacheTime = now;
	            }


				symbols.forEach((symbol) => {
					promise = promise.then(() => {
						return this.getMarketIndex(symbol.id);
					});

					promise = promise.then((data) => {
						result.push(Object.assign({}, symbol, {change:parseFloat(data.changePercent)}));
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

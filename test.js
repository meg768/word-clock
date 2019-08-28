#!/usr/bin/env node


class Weather {

	constructor(options = {}) {

		if (process.env.OPENWEATHERMAP_LOCATION == undefined || process.env.OPENWEATHERMAP_API_KEY == undefined)
			throw new Error('You need to specify both weather location and API key.');


		this.weather = {'REGN':1.0, 'MOLN':1.0, 'SNÖ':1.0, 'VIND':1.0, 'SOL':1.0};
		this.debug = options.debug ? options.debug : () => {};

		this.subscribe();
	};

	getSunFactor(response) {
		return 1.0 - this.getCloudFactor(response);
	}

	getCloudFactor(response) {
		if (response.clouds && response.clouds.all) {
			return parseInt(response.clouds.all) / 100;
		}
		else {
			return 0;
		}

	}

	getWindFactor(response) {		
		if (response.wind && response.wind.speed) {
			var maxWindSpeed = 20;
			var winSpeed = parseFloat(response.wind.speed);

			return Math.min(1.0, winSpeed / maxWindSpeed);
		}
		else {
			return 0;
		}

	}

	getRainFactor(response) {
		var rain = 0;		

		if (response.rain) {
			var rain1h = 0;
			var rain3h = 0;

			if (response.rain['1h']) {
				rain1h = parseFloat(response.rain['1h']);
			}

			if (response.rain['3h']) {
				rain3h += parseFloat(response.rain['3h']) / 3;
			}

			rain = (rain3h + rain1h) / 2;
		}

		return rain;
	}

	translateWeather(response) {

		var state = {};

		state['MOLN'] = this.getCloudFactor(response);
		state['VIND'] = this.getWindFactor(response);
		state['REGN'] = this.getRainFactor(response);
		state['SOL']  = this.getSunFactor(response);

		return state;
	};

	fetchWeather() {
		var Request = require('yow/request');

		return new Promise((resolve, reject) => {
			var api = new Request('https://api.openweathermap.org');

			var query = {};
			query.q = process.env.OPENWEATHERMAP_LOCATION;
			query.appid = process.env.OPENWEATHERMAP_API_KEY;
	
			api.get('/data/2.5/weather', {query:query}).then((response) => {
				this.weather = this.translateWeather(response.body);
				this.debug('Current weather is', this.weather);
				resolve(this.weather);
			})
			.catch((error) => {
				reject(error);
			})	
		});
	}

	subscribe() {
		var schedule = require('node-schedule');

		//schedule.scheduleJob({minute:[5, 20, 35, 50]}, this.fetchWeather);
		schedule.scheduleJob({second:0}, this.fetchWeather.bind(this));
		this.fetchWeather();
	}


};


class App {

	constructor() {
		require('dotenv').config();
		this.log = console.log;
		this.weather = new Weather({debug:console.log});
		
	}

	run() {
		this.weather.subscribe();
		/*
		this.weather.getWeather().then((response) => {
			this.log('response', response);
		})
		.catch((error) => {
			this.log(error);
		})
		*/

	}
}


var app = new App();
app.run();
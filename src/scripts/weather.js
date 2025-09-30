var schedule = require('node-schedule');
var isArray = require('yow/isArray');
var sprintf = require('yow/sprintf');
var debug = require('./debug.js');

class Weather {
	constructor(options = {}) {
		if (process.env.OPENWEATHERMAP_LAT == undefined || process.env.OPENWEATHERMAP_LON == undefined || process.env.OPENWEATHERMAP_API_KEY == undefined)
			throw new Error('You need to specify both weather location (lat/lon) and API key.');

		this.weather = { REGN: 1.0, MOLN: 1.0, SNÖ: 1.0, VIND: 1.0, SOL: 1.0 };
		this.subscribe();
	}

	getSunFactor(response) {
		return 1.0 - this.getCloudFactor(response);
	}

	getCloudFactor(response) {
		if (response.clouds && response.clouds.all) {
			return parseInt(response.clouds.all) / 100;
		} else {
			return 0;
		}
	}

	getWindFactor(response) {
		if (response.wind && response.wind.speed) {
			var maxWindSpeed = 20;
			var winSpeed = parseFloat(response.wind.speed);

			return Math.min(1.0, winSpeed / maxWindSpeed);
		} else {
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
		state['SOL'] = this.getSunFactor(response);

		return state;
	}
	/*
	async getLocation() {
		var Request = require('yow/request');
		var api = new Request('http://ip-api.com');
		
		var json = await api.get('/json');
		console.log(json);
	}
*/

	async getLocation() {
		try {
			const res = await fetch('http://ip-api.com/json');

			if (!res.ok) {
				throw new Error(`ip-api HTTP ${res.status} ${res.statusText}`);
			}

			const json = await res.json();

			debug('Weather location is', json);

			if (json.status !== 'success') {
				throw new Error(`ip-api error: ${json.message || 'unknown error'}`);
			}

			return { lat: json.lat, lon: json.lon };
		} catch (err) {
			debug('Failed to fetch location:', err);
			throw err;
		}
	}

	// Node 18+ (fetch finns globalt)
	async fetchWeather() {
		try {
			debug('Fetching weather...');

			let location = await this.getLocation();

			const params = new URLSearchParams({
				lat: location.lat,
				lon: location.lon,
				appid: process.env.OPENWEATHERMAP_API_KEY
			});

			const url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;

			// Timeout (ms) – AbortSignal.timeout finns i Node 18+
			const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

			if (!res.ok) {
				// Försök få med feltext från API:t om möjligt
				let details = '';
				try {
					details = JSON.stringify(await res.json());
				} catch {}
				throw new Error(`OpenWeatherMap HTTP ${res.status}: ${res.statusText} ${details}`);
			}

			const json = await res.json();
			this.weather = this.translateWeather(json);
			debug('Current weather is', this.weather);
			return this.weather;
		} catch (err) {
			debug('Failed to fetch weather:', err);
			throw err;
		}
	}

	async fetchWeatherX() {
		var Request = require('yow/request');

		debug('Fetching weather...');
		var api = new Request('https://api.openweathermap.org');

		var query = {};
		query.lat = process.env.OPENWEATHERMAP_LAT;
		query.lon = process.env.OPENWEATHERMAP_LON;
		query.appid = process.env.OPENWEATHERMAP_API_KEY;

		let response = await api.get('/data/2.5/weather', { query: query });
		this.weather = this.translateWeather(response.body);
		debug('Current weather is', this.weather);
	}

	subscribe() {
		var schedule = require('node-schedule');

		schedule.scheduleJob({ minute: [0, 30] }, this.fetchWeather.bind(this));
		this.fetchWeather();
	}
}

class OldWeather {
	constructor(location) {
		this.location = location;
		this.weather = { REGN: 1.0, MOLN: 1.0, SNÖ: 1.0, VIND: 1.0, SOL: 1.0 };

		var fetch = () => {
			this.getWeather()
				.then(weather => {
					this.weather = weather;
				})
				.catch(error => {
					console.error(error);
				});
		};

		schedule.scheduleJob({ minute: [0, 20, 40] }, fetch);
		fetch();
	}

	fetchWeather(location) {
		return new Promise((resolve, reject) => {
			try {
				var weather = require('weather-js');

				// Options:
				// search:     location name or zipcode
				// degreeType: F or C

				debug('Fetching weather...');

				weather.find({ search: location, degreeType: 'C' }, (error, result) => {
					try {
						if (error) reject(error);
						else {
							debug(result);

							resolve(result);
						}
					} catch (error) {
						console.log(error);
						reject(error);
					}
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	getWeatherState(text) {
		switch (text) {
			case 'Cloudy':
				return { MOLN: 1.0 };

			case 'Mostly Cloudy':
				return { SOL: 0.25, MOLN: 0.75 };

			case 'Partly Cloudy':
				return { SOL: 0.75, MOLN: 0.25 };

			case 'Partly Sunny':
				return { SOL: 0.5, MOLN: 0.5 };

			case 'Mostly Sunny':
				return { SOL: 0.75, MOLN: 0.25 };

			case 'Clear':
			case 'Sunny':
				return { SOL: 1.0 };

			case 'Mostly Clear':
				return { SOL: 0.75, MOLN: 0.25 };

			case 'Rain':
				return { REGN: 1.0, MOLN: 1.0 };

			case 'Light Rain':
				return { REGN: 0.5, MOLN: 0.5 };

			case 'Rain Showers':
				return { REGN: 0.5, MOLN: 0.5 };

			case 'Fog':
				return { SOL: 0.25, MOLN: 0.25 };

			case 'T-Storms':
				return { MOLN: 1.0, REGN: 0.5, VIND: 1.0 };

			case 'Snow':
				return { MOLN: 1.0, SNÖ: 1.0 };

			case 'Light Snow':
				return { MOLN: 0.5, SNÖ: 0.5 };
		}

		console.log(sprintf("Weather condition '%s' not defined.", text));

		return { REGN: 1.0, MOLN: 1.0, SNÖ: 1.0, VIND: 1.0, SOL: 1.0 };
	}

	getWeather() {
		return new Promise((resolve, reject) => {
			this.fetchWeather(this.location)
				.then(weather => {
					if (isArray(weather)) weather = weather[0];

					resolve(this.getWeatherState(weather.current.skytext));
				})
				.catch(error => {
					reject(error);
				});
		});
	}
}

module.exports = Weather;

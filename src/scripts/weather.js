var schedule = require('node-schedule');
var sprintf = require('yow/sprintf');
var debug = require('./debug.js');

class Weather {
	constructor(options = {}) {
		this.weather = { REGN: 1.0, MOLN: 1.0, SNÖ: 1.0, VIND: 1.0, SOL: 1.0 };
		this.location = null;
		this.subscribe();
	}

	subscribe() {
		var schedule = require('node-schedule');

		schedule.scheduleJob({ minute: [0, 10] }, this.fetchWeather.bind(this));
		this.fetchWeather();
	}

	async getLocation() {
		try {
			if (this.location) {
				return this.location;
			}

			const res = await fetch('http://ip-api.com/json');

			if (!res.ok) {
				throw new Error(`ip-api HTTP ${res.status} ${res.statusText}`);
			}

			const json = await res.json();

			debug('Weather location is', json);

			if (json.status !== 'success') {
				throw new Error(`ip-api error: ${json.message || 'unknown error'}`);
			}

			return (this.location = json);
		} catch (err) {
			debug('Failed to fetch location:', err);
			throw err;
		}
	}

	async fetchWeather() {
		let location = await this.getLocation();

		if (!location || typeof location.lat !== 'number' || typeof location.lon !== 'number') {
			throw new Error('Invalid location object: behöver lat och lon');
		}

		const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location.lat}&lon=${location.lon}`;

		const res = await fetch(url, {
			headers: {
				'User-Agent': 'WordClock/1.0 (magnus@example.com)'
			}
		});

		if (!res.ok) {
			throw new Error(`MET Norway HTTP ${res.status} ${res.statusText}`);
		}

		const data = await res.json();
		const now = data.properties.timeseries[0];
		const details = now.data.instant.details;

		const rainMm = details.precipitation_amount ?? 0;
		const cloudFrac = details.cloud_area_fraction ?? 0;
		const wind = details.wind_speed ?? 0;

		const symbol = now.data.next_1_hours?.summary?.symbol_code || now.data.next_6_hours?.summary?.symbol_code || '';

		let factors = {
			rain: 0,
			snow: 0,
			clouds: Math.min(cloudFrac / 100, 1),
			wind: Math.min(wind / 20, 1),
			clear: 0
		};

		if (symbol.includes('rain')) {
			factors.rain = Math.min(1, rainMm / 2); // 2 mm/h ≈ 100 %
		}
		if (symbol.includes('snow')) {
			factors.snow = 1;
		}

		// gör clear till "resten"
		const maxVal = Math.max(factors.rain, factors.snow, factors.clouds);
		factors.clear = Math.max(0, 1 - maxVal);

		this.weather['MOLN'] = factors.clouds;
		this.weather['VIND'] = factors.wind;
		this.weather['REGN'] = factors.rain;
		this.weather['SNÖ'] = factors.snow;
		this.weather['SOL'] = factors.clear;

		debug('Updated weather:', this.weather);

		return factors;
	}
}

module.exports = Weather;

var Events = require('events');
var schedule = require('node-schedule');

const debug = require('./debug.js');
const { threadId } = require('worker_threads');

class Weather extends Events {
	constructor(options = {}) {
		super(options);
		this.state = { REGN: 1.0, MOLN: 1.0, SNÖ: 1.0, VIND: 1.0, SOL: 1.0 };
		this.location = null;
		this.subscribe();
	}

	subscribe() {
		let fetch = async () => {
			await this.fetchWeather();
		};

		schedule.scheduleJob({ minute: [0, 15, 30, 45] }, fetch);
		fetch();
	}

	async getLocation() {
		try {
			if (this.location) {
				return this.location;
			}

			const result = await fetch('http://ip-api.com/json?fields=status,message,lat,lon,city,country');

			if (!result.ok) {
				throw new Error(`ip-api HTTP ${result.status} ${result.statusText}`);
			}

			const json = await result.json();
			debug('Weather location is', json.city);

			if (json.status !== 'success') {
				throw new Error(`ip-api error: ${json.message || 'unknown error'}`);
			}

			return (this.location = json);
		} catch (error) {
			debug('Failed to fetch location:', error);
			throw error;
		}
	}

	// Beräkna faktorer (0–1) från MET "now"-objekt
	computeFactors(now) {
		const details = now?.data?.instant?.details || {};
		const precip1h = now?.data?.next_1_hours?.details?.precipitation_amount;
		const precip6h = now?.data?.next_6_hours?.details?.precipitation_amount;
		const symbol = now?.data?.next_1_hours?.summary?.symbol_code || now?.data?.next_6_hours?.summary?.symbol_code || '';

		// mm/h: använd 1h om finns, annars dela 6h med 6
		const rainMm = Number.isFinite(precip1h) ? precip1h : Number.isFinite(precip6h) ? precip6h / 6 : 0;

		const cloudsPct = details.cloud_area_fraction ?? 0; // 0–100
		const windMs = details.wind_speed ?? 0; // m/s

		const clouds = Math.min(Math.max(cloudsPct / 100, 0), 1);
		const wind = Math.min(Math.max(windMs / 20, 0), 1); // 20 m/s ~ 1.0

		let rain = 0;
		let snow = 0;

		const s = String(symbol);
		const has = x => s.includes(x);

		// Regnindikatorer
		if (has('rain') || has('drizzle')) {
			rain = Math.min(1, (rainMm || 0) / 2); // ~2 mm/h ⇒ 1.0
		}

		// Snö/sleet
		if (has('snow') || has('snowshowers')) {
			snow = 1;
		} else if (has('sleet') || has('sleetshowers') || has('snowrain')) {
			// blandning – ge minst 0.5, skala upp med intensitet
			snow = Math.min(1, 0.5 + (rainMm || 0) / 4);
		}

		const clear = Math.max(0, 1 - Math.max(rain, snow, clouds));

		return { rain, snow, clouds, wind, clear };
	}

	async fetchWeather() {
		try {
			const location = await this.getLocation();

			if (!location || typeof location.lat !== 'number' || typeof location.lon !== 'number') {
				throw new Error('Invalid location object: behöver lat och lon');
			}

			const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location.lat}&lon=${location.lon}`;

			const options = {
				headers: { 'User-Agent': 'WordClock/1.0 (magnus@example.com)' }
			};

			// Timeout om tillgänglig (Node 18+)
			if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
				options.signal = AbortSignal.timeout(7000);
			}

			debug(`Fetching weather from ${url}`);
			const result = await fetch(url, options);
			if (!result.ok) {
				throw new Error(`MET Norway HTTP ${result.status} ${result.statusText}`);
			}

			const data = await result.json();
			const now = data?.properties?.timeseries?.[0];
			if (!now) {
				throw new Error('MET: saknar timeseries[0]');
			}

			const factors = this.computeFactors(now);

			// Uppdatera svenska nycklar
			this.state.REGN = factors.rain;
			this.state.MOLN = factors.clouds;
			this.state.SNÖ = factors.snow;
			this.state.VIND = factors.wind;
			this.state.SOL = factors.clear;

			debug('Fetched weather:', JSON.stringify(this.state));
			this.emit('weather', this.state);
		} catch (err) {
			debug('fetchWeather failed:', err);
		}
	}
}

module.exports = Weather;

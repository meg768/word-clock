var WordAnimation = require('./word-animation.js');
var Color = require('color');
var debug = require('./debug.js');

var cache = {};


module.exports = class CachedWordAnimation extends WordAnimation {

	constructor(options) {
		super({name:'Cached Word Animation', ...options});

		if (cache[this.name] == undefined) {
			debug('Creating cache for animation', this.name);
			cache[this.name] = {};
		}

		this.cache = cache[this.name];
		this.timeout = null;
		this.fetchInterval = 60000;
	}

	start() {
		var now = new Date();
		var delay = 0;

		var fetch = () => {
			return new Promise((resolve, reject) => {
	
				debug('Animation', this.name, 'is fetching data...');
	
				this.fetch().then((data) => {
			
					debug('Storing fetched data to cache...');
	
					this.cache.timestamp = new Date();
					this.cache.data = data;
	
					this.render();
					this.setTimeout(fetch.bind(this), this.fetchInterval);
	
					resolve();
	
				})
				.catch((error) => {
					reject(error);
				});
		
			});
		
		}
	
		if (this.cache.timestamp != undefined) {
			debug('fetch() previously called', this.cache.timestamp);
			debug('Cache', now - this.cache.timestamp, 'ms old.');
			delay = Math.max(0, this.fetchInterval - (now - this.cache.timestamp));
		}

		debug('Calling fetch() in', delay / 1000, 'seconds...');
		this.setTimeout(fetch.bind(this), delay);

		return super.start();
	}

	stop() {
		this.clearTimeout();
		return super.stop();
	}

	clearTimeout() {
		if (this.timeout != null)
			clearTimeout(this.timeout);
		
		this.timeout = null;
	}

	setTimeout(fn, delay) {
		this.clearTimeout();
		this.timeout = setTimeout(fn, delay);
	}	

	fetch() {
		throw new Error('A fetch() method must be specified.');
	}


};


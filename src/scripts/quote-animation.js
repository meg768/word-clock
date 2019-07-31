var WordAnimation = require('./word-animation.js');
var Color = require('color');
var yahoo = require('yahoo-finance');
var debug = require('./debug.js');


module.exports = class Module extends WordAnimation {

	constructor(options) {
		var {quotes, ...options} = options;

		super({name:'Yahoo Animation', ...options});

		this.quotes = quotes;
	}



	getWords() {
		var words = [];
		var quotes = this.quotes.quotes;
		var symbols = this.quotes.symbols;

		symbols.forEach((symbol) => {
			var color = Color.rgb(32, 32, 32);
			var quote = quotes[symbol.symbol];

			if (quote != undefined && quote.change != undefined) {
				var change     = Math.max(-2, Math.min(2, quote.change));
				var hue        = change >= 0 ? 240 : 0;
				var saturation = 100;
				var luminance  = 10 + (Math.abs(change) / 2) * 40;
	
				if (Math.abs(quote.change) > 2)
					luminance = 60;
	
				if (Math.abs(quote.change) > 2.5)
					luminance = 65;
	
				if (Math.abs(quote.change) > 3)
					luminance = 70;
	
				color = Color.hsl(hue, saturation, 25);
				color = Color.hsl(hue, saturation, 50);
			}

			words.push({word:symbol.name, color:color});
		});

		return words;
		
	}

};


/*

module.exports = class Module extends WordAnimation {

	constructor(options) {
		var {symbols, quotes, ...options} = options;

		super({name:'Yahoo Animation', ...options});

		if (cache[this.name] == undefined) {
			debug('Creating cache for animation', this.name);
			cache[this.name] = {};
		}

		this.cache = cache[this.name];
		this.symbols = symbols;
		this.timeout = null;
		this.fetchInterval = 60000;
	}

	start() {
		var now = new Date();
		var delay = 0;

		if (this.cache.timestamp != undefined) {
			debug('fetchQuotes previously called', this.cache.timestamp);
			debug('Cache', now - this.cache.timestamp, 'ms old.');
			delay = Math.max(0, this.fetchInterval - (now - this.cache.timestamp));
		}

		debug('Calling fetchQuotes in', delay / 1000, 'seconds...');
		this.setTimeout(this.fetchQuotes.bind(this), delay);

		return super.start();
	}

	stop() {
		this.clearTimeout();
		return super.stop();
	}

	clearTimeout() {
		if (this.timeout != null) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}

	setTimeout(fn, delay) {
		this.clearTimeout();
		this.timeout = setTimeout(fn, delay);
	}	

	fetchQuotes() {

		return new Promise((resolve, reject) => {

			debug('Fetching quotes for symbols', this.symbols);

			var params = {};

			params.symbols = [];
			params.modules = ['price'];
	
			this.symbols.forEach((symbol) => {
				params.symbols.push(symbol.symbol);
			})

			yahoo.quote(params).then((data) => {
		
				var quotes = {};

				this.symbols.forEach((symbol) => {
					var change = data[symbol.symbol].price.regularMarketChangePercent;
					var price = data[symbol.symbol].price.regularMarketPrice;
	
					quotes[symbol.symbol] = {change:change, price:price};
				});
	
				debug('Storing quotes to cache...');
				this.cache.timestamp = new Date();
				this.cache.quotes = quotes;

				this.render();
				this.setTimeout(this.fetchQuotes.bind(this), this.fetchInterval);
				resolve();

			})
			.catch((error) => {
				reject(error);
			});
	
		});
	
	}
	

	getWords() {
		var words = [];
		var quotes = this.cache.quotes || {};

		this.symbols.forEach((symbol) => {
			var color = Color.rgb(32, 32, 32);
			var quote = quotes[symbol.symbol];

			if (quote != undefined && quote.change != undefined) {
				var change     = Math.max(-2, Math.min(2, quote.change));
				var hue        = change >= 0 ? 240 : 0;
				var saturation = 100;
				var luminance  = 10 + (Math.abs(change) / 2) * 40;
	
				if (Math.abs(quote.change) > 2)
					luminance = 60;
	
				if (Math.abs(quote.change) > 2.5)
					luminance = 65;
	
				if (Math.abs(quote.change) > 3)
					luminance = 70;
	
				color = Color.hsl(hue, saturation, 25);
				color = Color.hsl(hue, saturation, 50);
			}

			words.push({word:symbol.name, color:color});
		});

		return words;
		
	}

};

*/
var WordAnimation = require('./word-animation.js');
var Color = require('color');
var yahoo = require('yahoo-finance');
var debug = require('./debug.js');

var cache = {};

module.exports = class Module extends WordAnimation {

	constructor(options) {
		var {symbols, quotes, ...options} = options;

		super({name:'Yahoo Animation', ...options});

		if (cache[this.name] == undefined) {
			cache[this.name] = {timestamp:undefined, quotes:{}};
		}

		this.cache = cache[this.name];
		this.quotes = this.cache.quotes;
		this.symbols = symbols;
		this.timeout = null;
	}

	start() {
		this.fetchQuotes();
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
			var params = {};
	
			params.symbols = [];
			params.modules = ['price'];
	
			this.symbols.forEach((symbol) => {
				params.symbols.push(symbol.symbol);
			})
	
			debug('Fetching quotes for symbols', this.symbols);
	
			yahoo.quote(params).then((data) => {
	
				this.symbols.forEach((symbol) => {
					var change = data[symbol.symbol].price.regularMarketChangePercent;
					var price = data[symbol.symbol].price.regularMarketPrice;
	
					this.quotes[symbol.symbol] = {change:change, price:price};
				});
	
				this.render();
				this.setTimeout(this.fetchQuotes.bind(this), 10 * 1000);

				resolve(this.quotes);
			})
			.catch((error) => {
				reject(error);
			});
	
		});
	
	}
	

	getWords() {
		var words = [];

		this.symbols.forEach((symbol) => {
			var color = Color.rgb(32, 32, 32);
			var quote = this.quotes[symbol.symbol];

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
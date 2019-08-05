var WordAnimation = require('./word-animation.js');
var Color = require('color');
var Quotes = require('./quotes.js');
var debug = require('./debug.js');

var cache = {};

module.exports = class Module extends WordAnimation {

	constructor(options) {
		var {symbols, ...options} = options;

		super({name:'Yahoo Animation', renderFrequency: 60 * 1000, ...options});

		if (cache[this.name] == undefined) {
			var quotes = cache[this.name] = new Quotes(symbols);

			quotes.on('quotes', () => {
				this.render();
			});
		}

		this.quotes = cache[this.name];
		this.symbols = symbols;
	}



	getWords() {
		var words = [];
		var quotes = this.quotes.quotes;
		var symbols = this.symbols;

		symbols.forEach((symbol) => {
			var color = Color.rgb(32, 32, 32);
			var quote = quotes[symbol.symbol];

			if (quote != undefined && quote.change != undefined) {

				var change     = Math.max(-2, Math.min(2, quote.change * 100));
				var hue        = change >= 0 ? 240 : 0;
				var saturation = 100;
				var luminance  = 10 + (Math.abs(change) / 2) * 40;
		
				// Limit the current to the leds to about 500 mA 
				luminance = luminance * 0.65;

				color = Color.hsl(hue, saturation, luminance);
			}

			words.push({word:symbol.name, color:color});
		});

		return words;
		
	}

};

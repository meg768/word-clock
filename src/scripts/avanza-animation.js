var Animation   = require('rpi-neopixels').Animation;

var sprintf     = require('yow/sprintf');
var random      = require('yow/random');
var Colors      = require('color-convert');
var isArray     = require('yow/is').isArray;
var isString    = require('yow/is').isString;
var Timer       = require('yow/timer');
var AvanzaCache = require('./avanza-cache.js');
var Layout      = require('./layout.js');
var Color       = require('color');

var avanzaCache = new AvanzaCache();

module.exports = class extends Animation {


	constructor(pixels, options) {
		super(pixels, Object.assign({}, options));

		this.renderFrequency = 60 * 1000 * 15;
		this.name    = 'Avanza Animation';
		this.symbols = [];
		this.avanza  = avanzaCache;

	}


	getSymbols() {
		return [];
	}

	render() {

		var promise = this.avanza.getMarket(this.getSymbols());

		promise.then((symbols) => {

			var self    = this;
	        var pixels  = this.pixels;
	        var display = new Layout();
			var words   = [];

			symbols.forEach(function(symbol) {
				words.push(symbol.symbol);
			});

	        var lookup = display.lookupText(words.join(' '));

			if (lookup.length == symbols.length) {
				pixels.clear();

				for (var index = 0; index < symbols.length; index++) {
					var symbol = symbols[index];
					var layout = lookup[index];

					//symbol.change = random([-1, 1]) * Math.random() * 4;
					//console.log(symbol.change);

					var change     = Math.max(-2, Math.min(2, symbol.change));
					var hue        = change >= 0 ? 240 : 0;
					var saturation = 100;
					var luminance  = 10 + (Math.abs(change) / 2) * 40;

					if (Math.abs(symbol.change) > 2)
						luminance = 60;

					if (Math.abs(symbol.change) > 2.5)
						luminance = 65;

					if (Math.abs(symbol.change) > 3)
						luminance = 70;

					for (var i = 0; i < layout.text.length; i++) {
		                pixels.setPixelHSL(layout.x + i, layout.y, hue, saturation, luminance);
		            }

				}

		        pixels.render();

			}
			else {
				pixels.fillRGB(255, 0, 0);
				pixels.render();

			}


		})
		.catch((error) => {
			console.log(error);
		})



    }




};

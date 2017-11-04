var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var Colors     = require('color-convert');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Timer      = require('yow/timer');
var Avanza     = require('./avanza.js');
var Animation  = require('./animation.js');
var Layout     = require('./layout.js');
var Pixels     = require('./pixels.js');
var Color      = require('color');

var avanza = new Avanza();

module.exports = class extends Animation {


	constructor(strip, options) {
		super(strip, Object.assign({renderFrequency:60 * 1000 * 15}, options));

		this.name = 'Avanza Animation';
		this.symbols = [];

	}


	getSymbols() {
		return [];
	}

	render() {

		var promise = avanza.getMarket(this.getSymbols());

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

		        self.strip.render(pixels.getPixels(), {fadeIn:5});

			}
			else {
				pixels.fillRGB(255, 0, 0);
				self.strip.render(pixels.getPixels(), {fadeIn:5});

			}


		})
		.catch((error) => {
			console.log(error);
		})



    }




};

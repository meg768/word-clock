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

module.exports = class extends Animation {


	constructor(strip, options) {
		super(strip, options);

		this.name = 'Avanza Animation';
		this.avanza = new Avanza();

	}


	getSymbols() {
		return [];
	}

	render(symbols) {
		var self    = this;
        var pixels  = new Pixels(this.strip.width, this.strip.height);
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

				symbol.change = random([symbol.change, symbol.change, symbol.change, 2.1, 2.6, 3.1]);

				var change     = Math.max(-2, Math.min(2, symbol.change));
				var hue        = change >= 0 ? 240 : 0;
				var saturation = 100;
				var luminance  = 10 + (Math.abs(change) / 2) * 40;

				if (Math.abs(symbol.change) > 2)
					luminance = 60;

				if (Math.abs(symbol.change) > 2.5)
					luminance = 70;

				if (Math.abs(symbol.change) > 3)
					luminance = 80;

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

    }

	start() {

        return new Promise((resolve, reject) => {

			super.start().then(() => {
				return this.avanza.getMarket(this.getSymbols());
			})
			.then((data) => {
				this.render(data);
				resolve();
			})
            .catch((error) => {
                reject(error);
            });
        });
    }

	stop() {
		return super.stop();
	}


};

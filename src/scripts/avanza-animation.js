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

		console.log(symbols);

		symbols.forEach(function(symbol) {
			words.push(symbol.symbol);
		});

        var lookup = display.lookupText(words.join(' '));

		if (lookup.length == symbols.length) {
			pixels.clear();

			for (var index = 0; index < symbols.length; index++) {
				var symbol = symbols[index];
				var layout = lookup[index];
				console.log(symbol);

				for (var i = 0; i < layout.text.length; i++) {
					var color = parseFloat(symbol.change) >= 0 ? 'blue' : 'red';
	                pixels.setPixel(layout.x + i, layout.y, Color(color).rgbNumber());
	            }

			}
console.log('OK!!');
	        self.strip.render(pixels.getPixels(), {fadeIn:10});

		}
		else {
			pixels.fillRGB(255, 0, 0);
			self.strip.render(pixels.getPixels(), {fadeIn:10});

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


};

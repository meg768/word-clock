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

		this.name      = 'Avanza Currency';
		this.avanza    = new Avanza();

		this.symbols = ([
			{symbol: 'NOK', id:53293},
			{symbol: 'JPY', id:108702},
			{symbol: 'USD', id:19000},
			{symbol: 'GBP', id:108703},
			{symbol: 'EUR', id:18998},
			{symbol: 'DKK', id:53292},
			{symbol: 'CAD', id:108701}
		]);

	}



	displaySymbols(symbols) {
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

				for (var i = 0; i < layout.text.length; i++) {
					var color = symbol.change >= 0 ? 'blue' : 'red';
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
				this.displaySymbols(this.symbols);
				resolve();
			})
            .catch((error) => {
                reject(error);
            });
        });
    }


};

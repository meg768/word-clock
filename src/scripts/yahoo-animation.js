var Animation   = require('rpi-animations').Animation;
var Layout      = require('./layout.js');

var debug = require('./debug');

module.exports = class extends Animation {


	constructor(pixels, options) {
		super(options);

		this.pixels = pixels;
		this.renderFrequency = 60 * 1000;
		this.name = 'Yahoo Animation';

	}


	fetchQuotes() {
		return Promise.resolve([]);
	}

	render() {

		this.fetchQuotes().then((symbols) => {

	        var pixels  = this.pixels;
	        var display = new Layout();
			var words   = [];

			symbols.forEach((symbol) => {
				words.push(symbol.name);
			});

	        var lookup = display.lookupText(words.join(' '));

			if (lookup.length == symbols.length) {
				pixels.clear();

				for (var index = 0; index < symbols.length; index++) {
					var symbol = symbols[index];
					var layout = lookup[index];

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
				pixels.render({transition:'fade', duration:200});
			}
			else {
				pixels.fillRGB(255, 0, 0);
				pixels.render({transition:'fade', duration:200});

			}


		})
		.catch((error) => {
			console.log(error);
		})



    }




};

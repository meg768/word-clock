var WordAnimation = require('./word-animation.js');
var Weather = require('./weather.js');

var sprintf = require('yow/sprintf');
var debug = require('./debug.js');

module.exports = class extends WordAnimation {
	constructor(options) {
		super({ name: 'Weather Animation', renderFrequency: 60 * 1000, ...options });

		this.weather = new Weather();

		weather.on('weather', () => {
			this.render();
		});
	}

	getWords() {
		var state = this.weather.state;
        
		var words = 'SOL VIND SNÖ MOLN REGN'.split(' ').map(word => {
			var index = state[word];
			var hue = 240;
			var luminance = index == undefined ? 1 : index * 50;
			var color = sprintf('hsl(%d, 100%%, %d%%)', hue, parseInt(luminance));

			return {
				word: word,
				color: color
			};
		});

		return words;
	}
};

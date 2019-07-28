var WordAnimation = require('./word-animation.js');
var Color = require('color');
var yahoo = require('./yahoo-finance.js')
var debug = require('./debug.js');


var quotes = [];

module.exports = class Module extends WordAnimation {

	constructor(options) {
		super({name:'Yahoo Animation', ...options});

		this.quotes = this.getQuotes();
	}

	getQuotes() {
		return quotes;
	}

	start() {

		var loop = () => {
			
			debug('Fetching quotes...');

			yahoo.fetchQuotes(this.getQuotes()).then((response) => {
				this.quotes.length = 0;
				
				response.forEach((item) => {
					this.quotes.push(item);
				});

				setTimeout(loop, 5000);
			});

		};

		loop();

		return super.start();
	}

	getWords() {
		var words = [];

		this.quotes.forEach((item) => {
			var color = Color.rgb(32, 32, 32);

			if (item.change != undefined) {
				var change     = Math.max(-2, Math.min(2, item.change));
				var hue        = change >= 0 ? 240 : 0;
				var saturation = 100;
				var luminance  = 10 + (Math.abs(change) / 2) * 40;
	
				if (Math.abs(item.change) > 2)
					luminance = 60;
	
				if (Math.abs(item.change) > 2.5)
					luminance = 65;
	
				if (Math.abs(item.change) > 3)
					luminance = 70;
	
				color = Color.hsl(hue, saturation, luminance);
			}

			words.push({word:item.name, color:color});
		});

		return words;
		
	}

};
var Pixels = require('rpi-pixels');
var sprintf = require('yow/sprintf');
var isFunction = require('yow/isFunction');

var ws281x = require('rpi-ws281x-native');
var channel = null;

var debug = function () {};
var config = {};

class Neopixels extends Pixels {
	constructor() {
		super({ width: 13, height: 13 });

		this.length = this.width * this.height;
		this.content = new Uint32Array(this.length);
		this.speed = 0.5;
	}

	render(options) {

		if (options && options.transition == 'fade') {
			var tmp = channel.array;
			var duration = options.duration != undefined ? options.duration : 100;

			if (duration > 0) {
				var content = this.content;
				var pixels = this.pixels;
				var length = this.length;

				var numSteps = duration * this.speed;
				var then = new Date();

				for (var step = 0; step < numSteps; step++) {
					for (var i = 0; i < length; i++) {
						var r1 = (content[i] & 0xff0000) >> 16;
						var g1 = (content[i] & 0x00ff00) >> 8;
						var b1 = content[i] & 0x0000ff;

						var r2 = (pixels[i] & 0xff0000) >> 16;
						var g2 = (pixels[i] & 0x00ff00) >> 8;
						var b2 = pixels[i] & 0x0000ff;

						var red = r1 + (step * (r2 - r1)) / numSteps;
						var green = g1 + (step * (g2 - g1)) / numSteps;
						var blue = b1 + (step * (b2 - b1)) / numSteps;

						tmp[i] = (red << 16) | (green << 8) | blue;
					}

					ws281x.render();
				}

				var now = new Date();
				var time = now - then;

				debug(sprintf('Transition "%s %d" took %d milliseconds to run.', options.transition, duration, time));

				// Adjust speed factor
				if (options.speed == undefined) {
					var speed = (this.speed * duration) / time;
					this.speed = (this.speed + speed) / 2;
					debug(sprintf('Adjusting speed factor to %02f', this.speed));
				}
			}
		}

		// Save rgb buffer
		this.content.set(channel.array);

		// Display the current buffer
		ws281x.render();
	}
}


function configure() {
	function cleanup() {
		debug('Cleaning up...');
		ws281x.finalize();
		process.exit();
	}

	const options = {
		dma: 10,
		freq: 800000,
		gpio: 18,
		invert: false,
		brightness: 255,
		stripType: ws281x.stripType.WS2812
	};

	channel = ws281x(169, options);

	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGINT', cleanup);
	process.on('SIGTERM', cleanup);
}

configure();

module.exports = Neopixels;

/*

var Neopixels = require('rpi-neopixels');
var debug = require('./debug.js');

function configure() {

    function cleanup() {
        debug('Cleaning up...');
        var pixels = new Neopixels();

        pixels.fill('black');
        pixels.render();
        
        process.exit();
    }

    var stripType = 'grb';
    var width     = 13;
    var height    = 13;
    var map       = 'alternating-matrix';

    Neopixels.configure({debug:debug, map:map, width:width, height:height, stripType:stripType});

    process.on('SIGUSR1', cleanup);
    process.on('SIGUSR2', cleanup);
    process.on('SIGINT',  cleanup);
    process.on('SIGTERM', cleanup);
}


configure();

module.exports = Neopixels;

*/

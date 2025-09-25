var sprintf = require('yow/sprintf');
var isFunction = require('yow/isFunction');
var Pixels = require('./pixels.js');

var ws281x = require('rpi-ws281x-native');
var channel = null;

const DISPLAY_WIDTH = 13;
const DISPLAY_HEIGHT = 13;

var debug = function () {};

class Neopixels extends Pixels {
	constructor(options) {
		super(options);

		this.length = this.width * this.height;
		this.content = new Uint32Array(this.length);
		this.tmp = new Uint32Array(this.length);

		this.speed = 0.5;
	}

	render(options) {
		var tmp = this.tmp;
		var pixels = this.pixels;

		if (options && options.transition == 'fade') {
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

					channel.array.set(Neopixels.gammaCorrect(tmp));
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
		this.content.set(this.pixels);

		// Display the current buffer
		channel.array.set(Neopixels.gammaCorrect(this.pixels));
		ws281x.render();
	}
}

function configure() {
	function cleanup() {
		debug('Cleaning up...');
		ws281x.reset();
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

	channel = ws281x(DISPLAY_HEIGHT * DISPLAY_WIDTH, options);

	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGINT', cleanup);
	process.on('SIGTERM', cleanup);
}

configure();

module.exports = new Neopixels({ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, map: 'serpentine' });

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

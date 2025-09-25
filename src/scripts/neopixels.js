var sprintf = require('yow/sprintf');
var isFunction = require('yow/isFunction');
var Pixels = require('./pixels.js');

var ws281x = require('rpi-ws281x-native');
var channel = null;

const gammaCorrectionX = new Uint8Array([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 11,
	11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 21, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 27, 28, 29, 29, 30, 31, 31, 32, 33, 34, 34, 35, 36, 37, 37, 38, 39,
	40, 40, 41, 42, 43, 44, 45, 46, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 76, 77, 78, 79, 80, 81, 83, 84, 85, 86, 88,
	89, 90, 91, 93, 94, 95, 96, 98, 99, 100, 102, 103, 104, 106, 107, 109, 110, 111, 113, 114, 116, 117, 119, 120, 121, 123, 124, 126, 128, 129, 131, 132, 134, 135, 137, 138, 140, 142, 143, 145,
	146, 148, 150, 151, 153, 155, 157, 158, 160, 162, 163, 165, 167, 169, 170, 172, 174, 176, 178, 179, 181, 183, 185, 187, 189, 191, 193, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214,
	216, 218, 220, 222, 224, 227, 229, 231, 233, 235, 237, 239, 241, 244, 246, 248, 250, 252, 255
]);

const gammaCorrection = new Uint8Array([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3,
	4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 14, 15, 16, 17, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 38, 39, 41, 42,
	44, 45, 47, 48, 50, 52, 53, 55, 57, 59, 61, 62, 64, 66, 68, 70, 72, 74, 76, 78, 81, 83, 85, 87, 89, 92, 94, 96, 99, 101, 104, 106, 109, 111, 114, 117, 119, 122, 125, 128, 130, 133, 136, 139,
	142, 145, 148, 151, 154, 157, 160, 164, 167, 170, 173, 177, 180, 184, 187, 191, 194, 198, 202, 205, 209, 213, 216, 220, 224, 228, 232, 236, 240, 244, 248, 252, 255
]);



var debug = function () {};

class Neopixels extends Pixels {
	constructor() {
		super({ width: 13, height: 13 });

		this.length = this.width * this.height;
		this.content = new Uint32Array(this.length);
		this.tmp = new Uint32Array(this.length);

		this.speed = 0.5;
	}

	render(options) {
		var tmp = this.tmp;

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

					channel.array.set(tmp);
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
		channel.array.set(this.pixels);
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
		stripType: ws281x.stripType.WS2812,
		gamma: gammaCorrection
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

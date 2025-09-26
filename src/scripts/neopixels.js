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
	var width = 13;
	var height = 13;
	var map = 'alternating-matrix';

	Neopixels.configure({ debug: debug, map: map, width: width, height: height, stripType: stripType });

	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGINT', cleanup);
	process.on('SIGTERM', cleanup);
}

configure();

module.exports = Neopixels;

/*
var Neopixels = require('rpi-neopixels');


let config = {
	debug: true,
	width: 13,
	height: 13,
	map: 'serpentine',
	dma: 10,
	freq: 800000,
	gpio: 18,
	invert: false,
	brightness: 255,
	stripType: 'ws2811-grb'
};

module.exports = new Neopixels(config);
*/

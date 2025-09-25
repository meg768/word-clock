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

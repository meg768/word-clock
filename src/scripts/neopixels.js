var Neopixels = require('rpi-neopixels');
var ws281x = require('rpi-ws281x-native');


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
	stripType: 'ws2811-rgb' // ws281x.stripType.WS2812
};

module.exports = new Neopixels(config);

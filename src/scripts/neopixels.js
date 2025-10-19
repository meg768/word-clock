var Neopixels = require('rpi-neopixels');
var debug = require('./debug.js');

function configure() {

	var stripType = process.env.NEOPIXEL_STRIP_TYPE ? process.env.NEOPIXEL_STRIP_TYPE : 'grb';
	var width = 13;
	var height = 13;
	var map = 'alternating-matrix';
	var gamma = 2;

	Neopixels.configure({ debug: debug, map: map, width: width, height: height, stripType: stripType, gamma: gamma });

}

configure();

module.exports = Neopixels;


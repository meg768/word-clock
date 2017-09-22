var Color = require('color');

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Pixels   = require('./pixels.js');

module.exports = function NeopixelStrip(options) {


	options = options || {};

	var _this          = this;         // That
	var _debug         = 1;            // Output log messages to console?

	var _width         = 13;
	var _height        = 13;
	var _length        = _width * _height;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        = new Uint32Array(_length);
	//var tmp = new Uint32Array(_length);

	_this.length = _length;
	_this.width  = _width;
	_this.height = _height;

	_this.render = function(pixels) {

		var numSteps = 25;

		console.log('Fading...');

		for (var step = 0; step < numSteps; step++) {
			var tmp = new Uint32Array(_length);

			for (var i = 0; i < _length; i++) {
				var rgb1 = _pixels[i];
				var r1 = (rgb1 & 0xFF0000) >> 16;
				var g1 = (rgb1 & 0x00FF00) >> 8;
				var b1 = (rgb1 & 0x0000FF);

				var rgb2 = pixels[i];
				var r2 = (rgb2 & 0xFF0000) >> 16;
				var g2 = (rgb2 & 0x00FF00) >> 8;
				var b2 = (rgb2 & 0x0000FF);

				var red   = (r1 + (step * (r2 - r1)) / numSteps);
				var green = (g1 + (step * (g2 - g1)) / numSteps);
				var blue  = (b1 + (step * (b2 - b1)) / numSteps);

				var color = (red << 16) || (green << 8) | blue;

//				if (step == numSteps)
					//console.log(rgb1.toString(16), rgb2.toString(16), color.toString(16));

				tmp[i] = color;
//				console.log(tmp[i].toString(16));
			}


			_strip.render(tmp);
			sleep(50);
		}

		var tmp = new Uint32Array(_length);
		tmp.set(pixels);
		_strip.render(tmp);

		console.log('Setting...');
		_pixels.set(pixels);
	}


	function debug() {
		if (_debug)
			console.log.apply(this, arguments);
	}

	function init() {
		_strip.init(_length);

		var map = new Uint16Array(_length);

	    for(var i = 0; i<map.length; i++) {
	        var row = Math.floor(i / _width), col = i % _width;

	        if((row % 2) === 0) {
	            map[i] = i;
	        }
			else {
	            map[i] = (row+1) * _width - (col+1);
	        }
	    }

		_strip.setIndexMapping(map);
	}


	function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	}
/*
	_this.render = function() {

		_tmp.set(_pixels.getPixels());
		_strip.render(_tmp);

		// Save rgb buffer
		_rgb.setPixels(_tmp);

	}

*/

/*
	_this.show = function(numSteps) {



		for (var step = 0; step < numSteps; step++) {

			var i = 0;

			for (var y = 0; y < _height; y++) {
				for (var x = 0; x < _width; x++) {

					var rgb = _rgb.getPixel(x, y);
					var r1 = (rgb & 0xFF0000) >> 16;
					var g1 = (rgb & 0x00FF00) >> 8;
					var b1 = (rgb & 0x0000FF);

					var pixel = _pixels.getPixel(x, y);
					var r2 = (pixel & 0xFF0000) >> 16;
					var g2 = (pixel & 0x00FF00) >> 8;
					var b2 = (pixel & 0x0000FF);

					var red   = (r1 + (step * (r2 - r1)) / numSteps);
					var green = (g1 + (step * (g2 - g1)) / numSteps);
					var blue  = (b1 + (step * (b2 - b1)) / numSteps);

					var color = red << 16 || green << 8 | blue;

					_tmp[i++] = color;
				}
			}

			_strip.render(_tmp);
			sleep(50);
		}
		// Save rgb buffer
		_rgb.setPixels(_pixels.getPixels());

		_tmp.set(_pixels.getPixels());
		_strip.render(_tmp);

		return Promise.resolve();
	}

*/

	init();

};

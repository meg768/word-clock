var Color = require('color');

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;
var Pixels   = require('./pixels.js');

/*
function exitHandler(options, err) {
	neopixels.reset();
	if (err) console.log(err.stack);
	if (options.exit) process.exit();
}
*/
//do something when app is closing
//process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
//process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
//process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

module.exports = function NeopixelStrip(options) {


	options = options || {};

	var _this          = this;         // That
	var _debug         = 1;            // Output log messages to console?

	var _width         = 13;
	var _height        = 13;
	var _length        = _width * _height;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        = new Uint32Array(_length);


	_this.length = _length;
	_this.width  = _width;
	_this.height = _height;

	_this.render = function(pixels, options) {

		var tmp = new Uint32Array(_length);
		var numSteps = 50;

		function sleep(milliseconds) {
			var start = new Date().getTime();

			for (var i = 0; i < 1e7; i++) {
				if ((new Date().getTime() - start) > milliseconds){
					break;
				}
			}
		}

		if (options && options.fadeIn) {
			var numSteps = options.fadeIn;

			for (var step = 0; step < numSteps; step++) {

				for (var i = 0; i < _length; i++) {

					var r1 = (_pixels[i] & 0xFF0000) >> 16;
					var g1 = (_pixels[i] & 0x00FF00) >> 8;
					var b1 = (_pixels[i] & 0x0000FF);

					var r2 = (pixels[i] & 0xFF0000) >> 16;
					var g2 = (pixels[i] & 0x00FF00) >> 8;
					var b2 = (pixels[i] & 0x0000FF);

					var red   = (r1 + (step * (r2 - r1)) / numSteps);
					var green = (g1 + (step * (g2 - g1)) / numSteps);
					var blue  = (b1 + (step * (b2 - b1)) / numSteps);

					tmp[i] = (red << 16) | (green << 8) | blue;
				}
				_strip.render(tmp);
				sleep(50);
			}

		}
		// Save rgb buffer
		_pixels.set(pixels);

		// Display the current buffer
		tmp.set(_pixels);
		_strip.render(tmp);

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

/*
		function panic(options, error) {
			_strip.reset();

			if (error)
				console.log(error);

			if (options && options.exit)
				process.exit();

		}


		//do something when app is closing
		process.on('exit', panic.bind(null,{cleanup:true}));

		//catches ctrl+c event
		process.on('SIGINT', panic.bind(null, {exit:true}));

		//catches uncaught exceptions
		process.on('uncaughtException', panic.bind(null, {exit:true}));
*/
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

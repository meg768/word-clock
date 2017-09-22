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
	var _rgb           = new Pixels(_width, _height);
	var _pixels        = new Pixels(_width, _height);
	var _tmp           = new Uint32Array(_length);

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

	_this.pause = function(ms) {

		return new Promise(function(resolve, reject) {
			setTimeout(resolve, ms);
		});
	}


	_this.clear = function(options) {
		return _this.colorize(Object.assign({}, options, {offset: 0, length: _length, color: 'black'}));
	}

	_this.colorize = function(options) {

		return new Promise(function(resolve, reject) {
			var red   = 0;
			var green = 0;
			var blue  = 0;

			var length   = options.length;
			var offset   = options.offset;
			var duration = options.duration == undefined ? 300 : options.duration;

			if (options.color != undefined) {
				var color = options.color;

				if (color.red != undefined && color.green != undefined && color.blue != undefined) {
					red   = color.red;
					green = color.green;
					blue  = color.blue;
				}
				else {
					try {
						// Try to parse color
						var color = Color(color);

						// Convert to rgb
						color = color.rgb();

						red   = color.red();
						green = color.green();
						blue  = color.blue();

					}
					catch(error) {
						return reject(error);
					}

				}

			}
			else {
				red   = options.red != undefined ? options.red : red;
				green = options.green != undefined ? options.green : green;
				blue  = options.blue != undefined ? options.blue : blue;

			}

			// Round of decimal values, if any
			red    = Math.round(red);
			green  = Math.round(green);
			blue   = Math.round(blue);

			var color = red << 16 || green << 8 | blue;


			for (var i = 0; i < length; i++) {
				var x = (i + offset) % _width;
				var y = Math.floor((i + offset) / _width);

				_pixels.setPixel(x, y, color);
			}

			resolve();


		});
	};


	_this.render = function() {
		_display.set(_pixels.getPixels());
		_strip.render(_display);
	}

	_this.show = function(numSteps) {


		function sleep(milliseconds) {
		  var start = new Date().getTime();
		  for (var i = 0; i < 1e7; i++) {
		    if ((new Date().getTime() - start) > milliseconds){
		      break;
		    }
		  }
		}

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

		console.log(_pixels.getPixels().toString());
		_strip.render(_pixels.getPixels());
		console.log(_pixels.getPixels().toString());

		return Promise.resolve();
	}


	init();

};

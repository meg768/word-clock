var Color = require('color');

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;


module.exports = function NeopixelStrip(options) {

	const ACK = 6;
	const NAK = 21;

	options = options || {};


	var _this          = this;         // That
	var _debug         = 1;            // Output log messages to console?

	var _width         = 13;
	var _height        = 13;
	var _length        = _width * _height;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        =  new Uint32Array(_length);
	var _rgb           =  new Uint32Array(_length);


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
				_pixels[i + offset] = color;
			}

			resolve();


		});
	};

	_this.show = function(numSteps) {

		var display =  new Uint32Array(_length);

		for (var step = 0; step <= numSteps; step++) {

			for (var i = 0; i < _length; i++) {
				var r1 = (_rgb[i] & 0xFF) >> 16;
				var g1 = (_rgb[i] & 0xFF) >> 8;
				var b1 = (_rgb[i] & 0xFF);

				var r2 = (_strip[i] & 0xFF) >> 16;
				var g2 = (_strip[i] & 0xFF) >> 8;
				var b2 = (_strip[i] & 0xFF);

				var red   = r1 + (step * (r2 - r1)) / numSteps;
				var green = g1 + (step * (g2 - g1)) / numSteps;
				var blue  = b1 + (step * (b2 - b1)) / numSteps;


				display[i] = (red << 16) | (green << 8) | blue;



			}
			_strip.render(display);
		}

		_rgb = display;

		return Promise.resolve();
	}


	init();

};

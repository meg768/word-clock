var Color = require('color');

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;

module.exports = function NeopixelStrip(options) {


	options = options || {};

	var _this          = this;         // That
	var _debug         = 1;            // Output log messages to console?

	var _width         = 13;
	var _height        = 13;
	var _length        = _width * _height;
	var _strip         = require('rpi-ws281x-native');
	var _pixels        = new Uint32Array(_length);
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

	_this.getPixels = function() {
		return _pixels;
	}

	this.setPixels = function(pixels) {
		_pixels.set(pixels);
	}

	_this.length = _length;
	_this.width  = _width;
	_this.height = _height;

	_this.render = function() {
		_tmp.setPixels(_pixels);
		_strip.render(_tmp);
	}



	init();

};

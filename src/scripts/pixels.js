var Color = require('color');

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;


module.exports = function Pixels(width, height) {


	var _this = this;
	var _pixels = new Uint32Array(width * height);

	_this.setPixel = function(x, y, color) {
		_pixels[y * width + x] = color
	}

	_this.setPixelRGB = function(x, y, red, green, blue) {
 		_pixels[y * width + x] = (red << 16) | (green << 8) | blue;
	}

	_this.getPixel = function(x, y) {
		return _pixels[y * width + x];
	}

	_this.setPixels = function(pixels) {
		_pixels.set(pixels);
	}

	_this.getPixels = function() {
		return _pixels;
	}


};

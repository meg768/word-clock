var Color = require('color');

var isString = require('yow/is').isString;
var isObject = require('yow/is').isObject;


module.exports = function Pixels(width, height) {


	var _this = this;
	var _length = width * height;
	var _pixels = new Uint32Array(width * height);

	_this.width  = width;
	_this.height = height;

	_this.fill = function(color) {
		for (var i = 0; i < _length; i++)
			_pixels[i] = color;
	}

	_this.fillRGB = function(red, green, blue) {
		fill((red << 16) | (green << 8) | blue);
	}

	_this.clear = function() {
		_this.fill(0);
	}

	_this.setPixelAtIndex = function(index, color) {
		_pixels[index] = color;
	}

	_this.getPixelAtIndex = function(index) {
		return _pixels[index];
	}

	_this.setPixel = function(x, y, color) {
		_pixels[y * width + x] = color
	}

	_this.setPixelRGB = function(x, y, red, green, blue) {
 		_pixels[y * width + x] = (red << 16) | (green << 8) | blue;
	}

	_this.setPixelHSL = function(x, y, h, s, l) {
		_pixels[y * width + x] = Color.hsl(h, s, l).rgbNumber();
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

	_this.toUint32Array = function() {
		return _pixels;
	}




};

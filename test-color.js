#!/usr/bin/env node


var Color = require('color');

var App = function() {


	function run() {

		var colorHSL = Color({h:0, s:100, l:50});
		var colorRGB = Color({r:255, g:0, b:0});
		var colorText = Color('red');
		console.log(colorHSL, colorHSL.rgbNumber());
		console.log(colorRGB, colorRGB.rgbNumber());
		console.log(colorText, colorText.rgbNumber());
	};

	run();
};

var app = new App();

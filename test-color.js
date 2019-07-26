#!/usr/bin/env node


var Color = require('color');

var App = function() {


	function run() {

		var colorHSL = Color({h:0, s:100, l:50});
		var colorRGB = Color({r:255, g:0, b:0});
		console.log(colorHSL, colorHSL.rgbNumber());
		console.log(colorRGB, colorRGB.rgbNumber());
	};

	run();
};

var app = new App();

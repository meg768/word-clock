#!/usr/bin/env node


var Color = require('color');

var App = function() {


	function run() {

		var color = Color({h:0, s:100, l:50});
		console.log(color);
	};

	run();
};

var app = new App();

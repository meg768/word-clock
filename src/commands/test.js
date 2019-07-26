#!/usr/bin/env node


var Neopixels = require('../scripts/neopixels.js');
var MatrixAnimation = require('../scripts/matrix-animation.js');
var debug = require('../scripts/debug.js');



var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {

		var strip     = new Neopixels.Pixels();
		var animation = new MatrixAnimation(strip, {duration:-1, priority:'!', debug:true});

		return animation.run();


	}


	module.exports.command  = 'rain [options]';
	module.exports.describe = 'Make it rain';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

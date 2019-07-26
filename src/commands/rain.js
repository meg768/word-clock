#!/usr/bin/env node


var Neopixels = require('../scripts/neopixels.js');
var Animation = require('../scripts/matrix-animation.js');

var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {
		var animation = new Animation({pixels: new Neopixels.Pixels(), duration:-1, priority:'!', debug:true});
		return animation.run();
	}

	module.exports.command  = 'rain [options]';
	module.exports.describe = 'Display rain';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

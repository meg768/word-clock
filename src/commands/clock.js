#!/usr/bin/env node
var Neopixels = require('../scripts/neopixels.js');
var Animation = require('../scripts/clock-animation.js');
var debug = require('../scripts/debug.js');

1234567890123456789012345678901234567890123
OMXNASDAQDAXDOWJONESHANGSENGUSAUKBRICNIKKEI
var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {
		var animation = new Animation({pixels: new Neopixels(), duration:-1, priority:'!', debug:debug});
		return animation.run();
	}

	module.exports.command  = 'clock [options]';
	module.exports.describe = 'Display current time';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

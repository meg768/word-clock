#!/usr/bin/env node

var debug = require('../scripts/debug.js');

var Module = new (function () {
	function defineArgs(args) {
		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function (argv) {
			return true;
		});
	}

	function run(argv) {
		var Neopixels = require('../scripts/neopixels.js');
		var Animation = require('../scripts/currency-animation.js');
		
		var animation = new Animation({ pixels: new Neopixels(), duration: -1, priority: '!', debug: debug });
		return animation.run();
	}

	module.exports.command = 'currency [options]';
	module.exports.describe = 'Currency Animation';
	module.exports.builder = defineArgs;
	module.exports.handler = run;
})();

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
		var Animation = require('../scripts/word-animation.js');
		
		var animation = new Animation({ pixels: new Neopixels(), duration: -1, priority: '!', debug: true });

		return animation.run();
	}

	module.exports.command = 'word [options]';
	module.exports.describe = 'Test Word Animation';
	module.exports.builder = defineArgs;
	module.exports.handler = run;
})();

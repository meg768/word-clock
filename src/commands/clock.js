#!/usr/bin/env node
var debug = require('../scripts/debug.js');

var Module = new (function () {
	function defineArgs(args) {
		args.option('help', { alias: 'h', describe: 'Displays this information' });
		args.option('test', { alias: 't', describe: 'Test clock' });

		args.wrap(null);

		args.check(function (argv) {
			return true;
		});
	}

	function run(argv) {
		var ClockAnimation = require('../scripts/clock-animation.js');
		var Neopixels = require('../scripts/neopixels.js');
		
		var animation = null;

		animation = new ClockAnimation({ pixels: new Neopixels(), duration: -1, priority: '!', debug: debug });

		return animation.run();
	}

	module.exports.command = 'clock [options]';
	module.exports.describe = 'Display current time';
	module.exports.builder = defineArgs;
	module.exports.handler = run;
})();

#!/usr/bin/env node


var Neopixels = require('../scripts/neopixels.js');
var ClockAnimation = require('../scripts/clock-animation.js');

function debug() {
}


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {

        if (argv.debug) {
            debug = function() {
                console.log.apply(this, arguments);
            }
        }

		var animation = new ClockAnimation(new Neopixels.Pixels(), {duration:-1, priority:'!', debug:true});

		return animation.run();


	}

	module.exports.command  = 'clock [options]';
	module.exports.describe = 'Display current time';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

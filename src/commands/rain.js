#!/usr/bin/env node


var Matrix = require('rpi-neopixels').Matrix;
var MatrixAnimation = require('../scripts/matrix-animation.js');

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


		var strip            = new Matrix({width:13, height:13, debug:argv.debug});
		var animation        = new MatrixAnimation(strip, {duration:-1, priority:'!'});

		return animation.run();


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

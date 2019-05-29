#!/usr/bin/env node


var Neopixels = require('rpi-neopixels');
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


		Neopixels.configure({map:'alternating-matrix', width:13, height:13, stripType:'grb', debug:true});

        if (argv.debug) {
            debug = function() {
                console.log.apply(this, arguments);
            }
        }


		var strip     = new Neopixels.Pixels();
		var animation = new MatrixAnimation(strip, {duration:-1, priority:'!', debug:true});

		return animation.run();


	}


	module.exports.command  = 'rain [options]';
	module.exports.describe = 'Make it rain';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

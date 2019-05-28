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

	function mapping(width, height) {
		
		var map = new Uint16Array(width * height);

		for (var i = 0; i < map.length; i++) {
			var row = Math.floor(i / width), col = i % width;
	
			if ((row % 2) === 0) {
				map[i] = i;
			}
			else {
				map[i] = (row+1) * width - (col+1);
			}
		}
	
	}

	function run(argv) {


		Neopixels.configure({map:mapping(13, 13), width:13, height:13, debug:true});

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

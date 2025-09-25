#!/usr/bin/env node


var Neopixels = require('../scripts/neopixels.js');
var debug = require('../scripts/debug.js');


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

		return map;
	
	}

	function run(argv) {


		var pixels = new Neopixels();
		var offset = 0;

        setInterval(() => {

			console.log('Cycle colors');
			pixels.clear();
            pixels.fill('red');
            pixels.render({transition: 'fade', duration: 100});
            pixels.fill('blue');
			pixels.render({ transition: 'fade', duration: 100 });
    
    
        }, 1000);



	}


	module.exports.command  = 'colors [options]';
	module.exports.describe = 'Display colors';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

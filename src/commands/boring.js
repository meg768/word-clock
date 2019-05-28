#!/usr/bin/env node


var Neopixels = require('rpi-neopixels');

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


		Neopixels.configure({map:mapping(13, 13), width:13, height:13, stripType:'grb', debug:true});

		var pixels = new Neopixels.Pixels();
		var offset = 0;

        setInterval(() => {
            var x = offset % pixels.width;
            var y = Math.floor(offset / pixels.width);
            console.log('Loop', offset, x, y);
            pixels.clear();
            pixels.setPixelRGB(x, y, 255, 255, 255);
            pixels.render();
    
            offset = (offset + 1) % (pixels.width * pixels.height);
    
        }, 100);



	}


	module.exports.command  = 'boring [options]';
	module.exports.describe = 'Make it boring';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

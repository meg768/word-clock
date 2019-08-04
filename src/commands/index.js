#!/usr/bin/env node

var Neopixels = require('../scripts/neopixels.js');
var Animation = require('../scripts/index-animation.js');
var debug = require('../scripts/debug.js');

var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {
		var animation = new Animation({pixels: new Neopixels(), duration:-1, priority:'!', debug:true});
		return animation.run();


	}


	module.exports.command  = 'index [options]';
	module.exports.describe = 'Test Index Animation';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Strip = require('../scripts/neopixel-strip.js');
var Animation = require('../scripts/index-animation.js');

var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {


		var strip     = new Strip();
		var animation = new Animation(strip);

		console.log('Starting animation', animation.name, '...');

		animation.run().then(function() {
			console.log('Done.');
		})

		.catch(function(error) {
			console.log(error);
		})
	}


	module.exports.command  = 'avanza [options]';
	module.exports.describe = 'Run avanza animation';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

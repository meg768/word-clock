var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Strip = require('../scripts/neopixel-strip.js');
var Animation = require('../scripts/text-animation.js');

var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.option('text', {alias:'t', describe:'Text to display', default:'ABCDEFGHIJK'});
		args.option('color', {alias:'c', describe:'Color of text', default:'red'});

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {


		var options   = {
			text: argv.text,
			color: argv.color
		};

		var strip     = new Strip();
		var animation = new Animation(strip, options);

		console.log('Starting animation', animation.name, '...');

		animation.run().then(function() {
			console.log('Done.');
		})

		.catch(function(error) {
			console.log(error);
		})
	}


	module.exports.command  = 'text [options]';
	module.exports.describe = 'Run clock animation';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

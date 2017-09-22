#!/usr/bin/env node

var sprintf    = require('yow/sprintf');
var isObject   = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var isString   = require('yow/is').isString;
var random     = require('yow/random');
var isArray    = require('yow/is').isArray;
var Color      = require('color');


var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('text',       {alias:'t', describe:'Letters to colorize', default:'ABCDEFG'});
		args.option('color',      {alias:'c', describe:'Color', default:undefined});
		args.option('delay',      {alias:'d', describe:'Delay', default:8});

		args.check(function(argv) {

			if (argv.color == undefined) {
				argv.color = sprintf('hsl(%d, 100%%, 25%%)', 30 * random(12));
			}

			if (isArray(argv.color))
				argv.color = argv.color[0];

			return true;
		});

		args.wrap(null);
	}


	function run(argv) {
		try {
			var Strip = require('../scripts/neopixel-strip.js');
			var strip = new Strip();
			var display = new Display(strip);

			Promise.resolve().then(function() {

				var promise = strip.clear();
				var Layout  = require('../scripts/layout.js');
				var layout  = new Layout();

				var letters = argv.text.split('');


				letters.forEach(function(letter) {
					if (letter == ' ') {
						promise = promise.then(function() {
							return strip.pause(300);
						})
					}
					else {
						var words = layout.getLayout(letter);

						words.forEach(function(word) {
							promise = promise.then(function() {
								return strip.colorize({
									offset     : word.offset,
									length     : word.length,
									color      : argv.color
								});
							});

							promise = promise.then(function() {
								return strip.show(argv.delay);
							});

							promise = promise.then(function() {
								var color = Color(argv.color).darken(0.90);

								return strip.colorize({
									offset     : word.offset,
									length     : word.length,
									color      : color.hsl().string()
								});
							});
						});

					}
				});

				promise = promise.then(function() {
					return strip.show(argv.delay);
				});

				promise = promise.then(function() {
					return strip.clear();
				});

				promise = promise.then(function() {
					return strip.show(argv.delay * 2);
				});

				promise = promise.then(function() {
					console.log('Done.');
				});

				promise = promise.catch(function(error) {
					console.log(error);
				});


			});

		}
		catch(error) {
			console.log(error);
		}

	}


	module.exports.command  = 'type [options]';
	module.exports.describe = 'Type text';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

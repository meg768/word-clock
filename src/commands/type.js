#!/usr/bin/env node

var sprintf    = require('yow/sprintf');
var isObject   = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var isString   = require('yow/is').isString;
var config     = require('../scripts/config.js');


var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('text',       {alias:'t', describe:'Text strip to colorize', default:'ABCDEFG'});
		args.option('transition', {alias:'x', describe:'Transition effect', choices:['fade', 'wipe', 'set'], default:'fade'});
		args.option('duration',   {alias:'d', describe:'Transition duration', default:50});
		args.option('color',      {alias:'c', describe:'Color', default:"rgb(64,0,0)"});

		args.wrap(null);
	}


	function run(argv) {
		try {
			var Strip = require('../scripts/neopixel-strip.js');

			var strip = new Strip({
				address : argv.address,
				length  : argv.size
			});

			strip.initialize().then(function() {

				var promise = Promise.resolve();
				var Layout  = require('../scripts/layout.js');
				var layout  = new Layout();

				var letters = argv.text.split('');

				letters.forEach(function(letter) {
					if (letter == ' ') {
						promise = promise.then(function() {
							return strip.pause(argv.duration);
						})
					}
					else {
						var words = layout.getLayout(letter);

						words.forEach(function(word) {
							console.log(word);
							promise = promise.then(function() {
								return strip.colorize({
									offset     : word.offset,
									length     : word.length,
									color      : argv.color,
									transition : argv.transition,
									duration   : argv.duration
								});
							});
						});

					}
				});

				promise.then(function() {
					return strip.clear({transition:argv.transition, duration:500});
				})
				promise.then(function() {
					console.log('Done.');
				})
				.catch(function(error) {
					console.log(error);
				})


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
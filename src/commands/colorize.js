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

		args.option('offset',     {alias:'o', describe:'Offset on strip', default:0});
		args.option('color',      {alias:'c', describe:'Color', default:"rgb(0,0,0)"});
		args.option('text',       {alias:'t', describe:'Text strip to colorize', default:undefined});
		args.option('transition', {alias:'x', describe:'Transition effect', choices:['fade', 'wipe', 'set'], default:'fade'});
		args.option('duration',   {alias:'d', describe:'Transition duration', default:100});

		args.wrap(null);
	}


	function run(argv) {
		try {
			var Strip = require('../scripts/neopixel-strip.js');

			var strip = new Strip({
				address : argv.address,
				length  : argv.length
			});

			strip.initialize().then(function() {

				if (isString(argv.text)) {
					var Layout = require('../scripts/layout.js');
					var layout = new Layout();

					var words = layout.getLayout(argv.text);
					var promise = Promise.resolve();

					words.forEach(function(word) {
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

					promise.then(function() {
						console.log('Done.');
					})
					.catch(function(error) {
						console.log(error);
					})

				}
				else {
					strip.colorize({
						offset : argv.offset,
						length : argv.length,
						color  : argv.color
					})
					.catch(function(error) {
						console.log(error);
					})


				}


			})

		}
		catch(error) {
			console.log(error);
		}

	}


	module.exports.command  = 'colorize [options]';
	module.exports.describe = 'Colorize part of strip';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

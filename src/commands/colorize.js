#!/usr/bin/env node

var sprintf    = require('yow/sprintf');
var isObject   = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var isString   = require('yow/is').isString;
var isArray    = require('yow/is').isArray;
var random     = require('yow/random');


var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('offset',     {alias:'o', describe:'Offset on strip', default:0});
		args.option('length',     {alias:'l', describe:'Length of strip to colorize', default:undefined});
		args.option('color',      {alias:'c', describe:'Color', type: 'string', default:undefined});
		args.option('text',       {alias:'t', describe:'Text strip to colorize', default:undefined});
		args.option('delay',      {alias:'d', describe:'Delay', type: 'int', default:16});


		args.check(function(argv) {

			// ??
			if (argv.color == undefined) {
				argv.color = sprintf('hsl(%d, 100%%, 50%%)', 30 * random(12));
			}
			if (isArray(argv.color))
				argv.color = argv.color[0];

			return true;
		});

		args.wrap(null);
	}


	function run(argv) {
		try {

			Promise.resolve().then(function() {
				var Layout = new Layout();
				var Strip = require('../scripts/neopixel-strip.js');
				var strip = new Strip(13, 13);

				if (isString(argv.text)) {

					display.clear().then(function() {
						return display.show(argv.delay);
					})
					.then(function() {
						return display.drawText(argv.text, argv.color);
					})
					.then(function() {
						return display.show(argv.delay);
					})
					.then(function() {
						console.log('Done.');
					})
					.catch(function(error) {
						console.log(error);
					})

				}
				else {
					if (argv.length == undefined)
						argv.length = argv.size;

					display.colorize({
						offset     : argv.offset,
						length     : argv.length,
						color      : argv.color
					})
					.then(function() {
						return display.show(argv.delay);
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

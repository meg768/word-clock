#!/usr/bin/env node

var sprintf    = require('yow/sprintf');
var isObject   = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var isString   = require('yow/is').isString;
var isArray    = require('yow/is').isArray;
var config     = require('../scripts/config.js');


var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('offset',     {alias:'o', describe:'Offset on strip', default:0});
		args.option('length',     {alias:'l', describe:'Length of strip to colorize', default:undefined});
		args.option('color',      {alias:'c', describe:'Color', type: 'string', default:"rgb(32,0,0)"});
		args.option('text',       {alias:'t', describe:'Text strip to colorize', default:undefined});
		args.option('transition', {alias:'x', describe:'Transition effect', choices:['fade', 'wipe', 'set'], default:'fade'});
		args.option('duration',   {alias:'d', describe:'Transition duration', default:500});


		args.check(function(argv) {

			// ??
			if (isArray(argv.color))
				argv.color = argv.color[0];

			return true;
		});

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
								color      : argv.color
							});
						});
					});

					promise.then(function() {
						return strip.show(argv.duration);
					})

					.then(function() {
						return strip.pause(2000);
					})

					.then(function() {
						return strip.clear();
					})

					.then(function() {
						return strip.show(argv.duration);
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

					strip.colorize({
						offset     : argv.offset,
						length     : argv.length,
						color      : argv.color
					})
					.then(function() {
						return strip.show(argv.duration);
					})
					.then(function() {
						return strip.clear({transition:argv.transition, duration:500});
					})
					.then(function() {
						return strip.show(argv.duration);
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
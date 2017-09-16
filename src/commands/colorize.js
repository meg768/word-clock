#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var config = require('../scripts/config.js');


var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('offset',   {alias:'o', describe:'Offset on strip', default:0});
		args.option('length',   {alias:'l', describe:'Length to colorize', default:1});
		args.option('color',    {alias:'c', describe:'Color', default:"rgb(64,0,0)"});

		args.wrap(null);
	}


	function run(argv) {
		var Strip = require('../scripts/neopixel-strip.js');
		var strip = new Strip({
			address : config.i2c.address,
			length  : config.strip.length
		});

		strip.initialize().then(function() {

		})
//		console.log(layout.getLayout(argv.text));

	}


	module.exports.command  = 'colorize [options]';
	module.exports.describe = 'Colorize part of strip';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

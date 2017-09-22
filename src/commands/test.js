#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Color = require('color');
var strip = require('rpi-ws281x-native');
var neopixels = require('rpi-ws281x-native');

var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('text',       {alias:'t', describe:'Text to display', default:'FEM I HALV SEX'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}

	function exitHandler(options, err) {
		neopixels.reset();
	    if (err) console.log(err.stack);
	    if (options.exit) process.exit();
	}

	function run(argv) {
		var pixels = new new Uint32Array(13);
		neopixels.init(13);

		pixels[0] = Color().hsl(240, 100,50).rgbNumber(); 

		neopixels.render(pixels);

		//do something when app is closing
		//process.on('exit', exitHandler.bind(null,{cleanup:true}));

		//catches ctrl+c event
		//process.on('SIGINT', exitHandler.bind(null, {exit:true}));

		//catches uncaught exceptions
		//process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

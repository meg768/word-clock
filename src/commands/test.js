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

		args.option('text',       {alias:'t', describe:'Text to display', default:'FEM I HALV SEX'});

/*
		args.option('url',       {alias:'u', describe:'Socket IO url', default:config.service.url});
		args.option('address',   {alias:'a', describe:'I2C bus address', default:config.i2c.address});
		args.option('length',    {alias:'l', describe:'Neopixel strip length', default:config.strip.length});
		args.option('segments',  {alias:'s', describe:'Number of segments in strip', default:config.strip.segments});
		args.option('service',   {alias:'n', describe:'Service name', default:config.service.url});
		args.option('interval',  {alias:'i', describe:'Refresh interval for clock in seconds', default:60});
		args.option('debug',     {alias:'d', describe:'Debug, low lights', default:false});
*/
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {
		var Layout = require('../scripts/layout.js');
		var layout = new Layout();

		console.log(layout.getLayout(argv.text));

	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

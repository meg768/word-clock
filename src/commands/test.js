#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var Timer = require('yow/timer');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');
var Bluetooth = require('node-bluetooth');



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




	function run(argv) {

		var device = new Bluetooth.DeviceINQ();

		console.log('paired');
		device.listPairedDevices(console.log);
		console.log('Listening...');
		device.on('found', function found(address, name) {
  			console.log('Found: ' + address + ' with name ' + name);
		});

		device.inquire();
	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

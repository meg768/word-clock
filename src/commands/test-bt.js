#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var Timer = require('yow/timer');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');
var Bluetooth = require('bluetooth-serial-port');



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

		var BTSP = require('bluetooth-serial-port');
		var serial = new BTSP.BluetoothSerialPort();

		 	console.log('Started!');

		serial.on('found', function(address, name) {

		    // you might want to check the found address with the address of your
		    // bluetooth enabled Arduino device here.

		    serial.findSerialPortChannel(address, function(channel) {
				console.log(address, channel);
				/*
		        serial.connect(bluetoothAddress, channel, function() {
		            console.log('connected');
		            process.stdin.resume();
		            process.stdin.setEncoding('utf8');
		            console.log('Press "1" or "0" and "ENTER" to turn on or off the light.')

		            process.stdin.on('data', function (data) {
		                serial.write(data);
		            });

		            serial.on('data', function(data) {
		                console.log('Received: ' + data);
		            });
		        }, function () {
		            console.log('cannot connect');
		        });
				*/
		    });
		});

		serial.inquire();

	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};
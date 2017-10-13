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


		var btSerial = Bluetooth.BluetoothSerialPort();

		btSerial.on('found', function(address, name) {
		    btSerial.findSerialPortChannel(address, function(channel) {

				console.log('FOUND', address, channel);
				/*
		        btSerial.connect(address, channel, function() {
		            console.log('connected');

		            btSerial.write(new Buffer('my data', 'utf-8'), function(err, bytesWritten) {
		                if (err) console.log(err);
		            });

		            btSerial.on('data', function(buffer) {
		                console.log(buffer.toString('utf-8'));
		            });
		        }, function () {
		            console.log('cannot connect');
		        });

		        // close the connection when you're ready
		        btSerial.close();
				*/
		    }, function() {
		        console.log('found nothing');
		    });
		});

		btSerial.inquire();

	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var Timer = require('yow/timer');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');



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




	function runXX(argv) {

		var BT = require('node-bluetooth');

		var device = new BT.DeviceINQ();
		device.listPairedDevices(console.log);

		device
		.on('finished',  console.log.bind(console, 'finished'))
		.on('found', function found(address, name){
		  console.log('Found: ' + address + ' with name ' + name);
		}).inquire();

		var address = '20:73:00:3A:C3:07';

		device.findSerialPortChannel(address, function(channel){
  			console.log('Found RFCOMM channel for serial port on', 	channel);

  			// make bluetooth connect to remote device
  			BT.connect(address, channel, function(err, connection){
    			if(err) return console.error(err);
    			connection.write(new Buffer('Hello!', 'utf-8'));
  			});

		});
	}
	function run(argv) {

		var BTSP = require('bluetooth-serial-port');
		var serial = new BTSP.BluetoothSerialPort();
		var address = '20:73:00:3A:C3:07';

		 	console.log('Started!');

			function yes(channel) {
				console.log('FOUND CHANNEL', channel);
			}
			function no() {
				console.log('NO CHANNEL')
			}
			serial.findSerialPortChannel(address, yes, no);

		serial.on('found', function(address, name) {

			console.log('FOUND', address, name);
		    // you might want to check the found address with the address of your
		    // bluetooth enabled Arduino device here.

			function yes(channel) {
				console.log('FOUND CHANNEL', channel);
			}
			function no() {
				console.log('NO CHANNEL')
			}
			serial.findSerialPortChannel(address, yes, no);

/*
		    serial.findSerialPortChannel(address, function(channel) {
				console.log(address, channel);
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
		    });

		});

		serial.inquire();
*/
	}



	module.exports.command  = 'bt [options]';
	module.exports.describe = 'BT module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

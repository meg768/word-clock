#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');

class Buttons extends Events {

	constructor(args) {
		super(args);
	}

	init() {
		var self = this;
		var buttons = [
			{pin: 19, name:'Button 1'},
			{pin: 13, name:'Button 2'},
			{pin:  6, name:'Button 3'}
		];

		var Gpio = require('pigpio').Gpio;


		buttons.forEach(function(button) {
			var gpio = new Gpio(button.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});

			gpio.on('interrupt', function (level) {
				console.log(button.name, level ? 'pressed' : 'released');
				self.emit('change', button.name, level)
			});
		});

	}

}


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

		var button = new Buttons();

		buttons.on('change', function(name, level) {
			console.log('change', name, level);
		});
/*
		var buttons = [
			{pin: 19, name:'Button 1'},
			{pin: 13, name:'Button 2'},
			{pin:  6, name:'Button 3'}
		];

		var Gpio = require('pigpio').Gpio;


		buttons.forEach(function(button) {
			var gpio = new Gpio(button.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});

			gpio.on('interrupt', function (level) {
				console.log(button.name, level ? 'pressed' : 'released');
			});
		});
*/
	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

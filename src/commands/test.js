#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');

class Buttons extends Events {

	constructor(buttons) {
		super();
		this.buttons = buttons;
		this.gpios   = [];
	}

	start() {
		var self = this;


		var Gpio = require('pigpio').Gpio;


		self.buttons.forEach(function(button) {
			var gpio = new Gpio(button.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});

			self.gpios.push(gpio);

			gpio.on('interrupt', function (level) {
				self.emit(button.name, level)
			});
		});

	}

	stop() {
		var self = this;

		self.gpios.forEach(function(gpio) {
			gpio.removeAllListeners();
		});

		self.removeAllListeners();


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

		var buttons = new Buttons([
			{pin: 19, name:'Button 1'},
			{pin: 13, name:'Button 2'},
			{pin:  6, name:'Button 3'}
		]);
		buttons.start();
		console.log('Ready!');
		buttons.on('Button 1', function(level) {
			console.log('change1', level);
		});
		buttons.on('Button 2', function(level) {
			console.log('change2', level);
		});
		buttons.on('Button 3', function(level) {
			console.log('change3', level);
			buttons.stop();
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

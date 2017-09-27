#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');
var Gpio = require('pigpio').Gpio;

class Button extends Events {

	constructor(pin) {


		function timestamp() {
			var date = new Date();
			return date.valueOf();
		}

		super();

		this.pin   = pin;
		this.gpio  = new Gpio(pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
		this.state = 0;
		this.time  = timestamp();

		this.gpio.on('interrupt', (newState) => {

			var now       = timestamp();
			var time      = this.time;
			var state     = this.state;

			this.state = newState;
			this.time  = now;
			this.emit('change');

			// Released?
			if (state == 0) {
				events.push('pressed', now - time);
			}

		});

	}

};



class Buttons extends Events {

	constructor() {
		super();
		this.buttons = [];
		this.gpios   = [];

	}

	startListening(buttons) {
		var Gpio = require('pigpio').Gpio;

		var self = this;

		self.stopListening();
		self.buttons = buttons;

		self.led = new Gpio(20, {mode: Gpio.OUTPUT});

		self.buttons.forEach(function(button) {
			var gpio = new Gpio(button.pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
//			var gpio = new Gpio(button.pin, {mode: Gpio.INPUT, alert: true});

			self.gpios.push(gpio);

			gpio.on('interrupt', function (level) {
				self.led.digitalWrite(level);
				self.emit(button.name, level)
			});

		});

	}

	stopListening() {
		var self = this;

		self.gpios.forEach(function(gpio) {
			gpio.disableInterrupt();
			gpio.disableAlert();
		});

		this.buttons = [];
		this.gpios   = [];


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

		var button = new Button(13);
		var led = new Gpio(20, {mode: Gpio.OUTPUT});

		button.on('change', () => {
			console.log(button.state);
			led.digitalWrite(button.state);
		});

		button.on('pressed', (duration) => {
			console.log('pressed for', duration);
		});

		button.on('click', () => {
			console.log('click');
		});

		button.on('long-click', () => {
			console.log('long-click');
		});

		/*
		var buttons = new Buttons();

		buttons.startListening([
			{pin: 19, name:'Button 1'},
			{pin: 13, name:'Button 2'},
			{pin:  6, name:'Button 3'}
		]);

		console.log('Ready!');
		buttons.on('Button 1', function(level) {
			console.log('change1', level);
		});
		buttons.on('Button 2', function(level) {
			console.log('change2', level);
		});
		buttons.on('Button 3', function(level) {
			console.log('change3', level);

			console.log('bye!');
			buttons.stopListening();
		});
		*/
	}


	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test module';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

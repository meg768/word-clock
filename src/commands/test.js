#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var Timer = require('yow/timer');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events = require('events');
var Pigpio = require('pigpio');
var Gpio   = require('pigpio').Gpio;
var Button = require('../scripts/button.js');


/*

class Button extends Events {

	constructor(pin) {

		super();

		this.pin      = pin;
		this.gpio     = new Gpio(pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
		this.state    = 0;
		this.pressed  = 0;
		this.released = 0;
		this.clicks   = 0;
		this.timer    = new Timer();


	}

	start() {
		function timestamp() {
			var date = new Date();
			return date.valueOf();
		}

		this.pressed  = timestamp();
		this.released = timestamp();

		this.gpio.on('interrupt', (state) => {

			var now = timestamp();

			// Ignore if button already in current state
			if (state != this.state) {

				this.state = state;
				this.timer.cancel();

				this.emit('change', state, now);

				if (state == 0) {
					this.clicks++;

					this.timer.setTimer(250, () => {
						this.emit('click', this.clicks, now - this.pressed);
						this.clicks = 0;
					});

					this.released = now;
				}
				else {
					this.pressed = now;
				}

			}

		});
	}

	stop() {
		this.gpio.disableInterrupt();
	}

};


class Buttons extends Events {

	constructor() {
		super();

		this.buttons = [];
	}

	start(items) {
		var self = this;

		self.stop();

		items.forEach(function(item) {
			var button = new Button(item.pin);

			button.start();

			button.on('click', function(clicks, duration) {
				self.emit(item.name, clicks, duration);
			});

			self.buttons.push(button);
		});
	}

	stop() {
		var self = this;

		self.buttons.forEach(function(button) {
			button.stop();
		});

		self.buttons = [];

	}

};

*/
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

/*
		var buttons =  new Buttons();

		console.log('button OK');

		buttons.start([
			{pin:6,  name:'upper'},
			{pin:13, name:'lower'},
		]);

		buttons.on('upper', function(clicks, duration) {
			console.log('upper', clicks, duration);
		});

		buttons.on('lower', function(clicks, duration) {
			console.log('EXISTS');
			buttons.stop();
		});

*/


		var button = new Button(13);
		var button6 = new Button(6);

		console.log('button OK');

		button.start();
		button6.start();


		button6.on('click', (clicks, duration) => {
			console.log('upper button', clicks, duration);
		});

		button.on('click', (clicks, duration) => {
			console.log('lower button', clicks, duration);
			if (button6.state && clicks > 1) {
				console.log('exiting', clicks, duration);
				button.stop();
				button6.stop();

			}

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

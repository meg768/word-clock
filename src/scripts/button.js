
var sprintf    = require('yow/sprintf');
var Timer      = require('yow/timer');
var isObject   = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Events     = require('events');
var Pigpio     = require('pigpio');
var Gpio       = require('pigpio').Gpio;

module.exports = class Button extends Events {

	constructor(pin) {

		super();

		this.pin      = pin;
		this.gpio     = new Gpio(pin, {mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});
		this.state    = 0;
		this.pressed  = 0;
		this.released = 0;
		this.clicks   = 0;
		this.timer    = new Timer();

		this.gpio.enableInterrupt(Gpio.EITHER_EDGE);
		this.gpio.enableAlert();

	}

	start() {
		function timestamp() {
			var date = new Date();
			return date.valueOf();
		}

		this.pressed  = timestamp();
		this.released = timestamp();

		this.gpio.on('alert', (state) => {

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

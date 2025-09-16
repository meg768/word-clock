var Events     = require('events');
var Pigpio     = require('pigpio');
var Gpio       = require('pigpio').Gpio;

function isInteger(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFunction(obj) {
	return typeof obj === 'function';
};

function debug() {
}

module.exports = class Button extends Events {

	constructor(options) {

		super();

		if (isInteger(options))
			options = {pin:options, debug:debug};

		options = Object.assign({}, {autoEnable:true, timeout:250, defaultState:0}, options);

		if (isFunction(options.debug))
			debug = options.debug;

		if (options.pin == undefined)
			throw new Error('Must supply a pin for the button.');

		this.pin          = options.pin;
		this.defaultState = options.defaultState;
		this.state        = options.defaultState;
		this.timeout      = options.timeout;
		this.pressed      = 0;
		this.released     = 0;
		this.clicks       = 0;
		this.timer        = null;
		this.gpio         = new Gpio(this.pin, {mode: Gpio.INPUT, pullUpDown: this.defaultState ? Gpio.PUD_UP : Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE});

		if (options.autoEnable)
			this.enable();

	}

	enable() {
		function timestamp() {
			var date = new Date();
			return date.valueOf();
		}

		this.pressed  = timestamp();
		this.released = timestamp();

		this.gpio.on('interrupt', (state, time) => {

			var now = timestamp();

			// Ignore if button already in current state
			if (state != this.state) {

				this.state = state;

				if (this.timer != null) {
					clearTimeout(this.timer);
					this.timer = null;
				}

				this.emit(state ? 'press' : 'release', now);
				this.emit('change', state, now);

				if (state == this.defaultState) {
					this.clicks++;

					this.timer = setTimeout(() => {
						this.emit('click', this.clicks, now - this.pressed);
						this.clicks = 0;
					}, this.timeout);

					this.released = now;
				}
				else {
					this.pressed = now;
				}

			}

		});
	}

	disable() {
		this.gpio.disableInterrupt();
	}

};

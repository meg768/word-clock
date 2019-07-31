#!/usr/bin/env node

var Timer = require('yow/timer');
var Button = require('pigpio-button');

var Neopixels = require('../scripts/neopixels.js');
var AnimationQueue = require('rpi-animations').Queue;
var debug = require('../scripts/debug.js');

var ClockAnimation     = require('../scripts/clock-animation.js');
var WeatherAnimation   = require('../scripts/weather-animation.js');
var CurrencyAnimation  = require('../scripts/currency-animation.js');
var CommodityAnimation = require('../scripts/commodity-animation.js');
var IndexAnimation     = require('../scripts/index-animation.js');
var ColorAnimation     = require('../scripts/color-animation.js');
var MatrixAnimation    = require('../scripts/matrix-animation.js');


var Module = new function() {

	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}

	function run(argv) {

		var leftButton       = new Button(13);
		var rightButton      = new Button(6);
		var pixels           = new Neopixels.Pixels();

		var mode             = 'loop';
		var animationQueue   = new AnimationQueue();

		var loopAnimations   = [ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation, WeatherAnimation];
		var loopDuration     = 10000;
		var loopIndex        = 0;

		leftButton.on('click', (clicks) => {

			loopIndex = 0;
			mode = (mode != 'off') ? 'off' : 'loop';

			runNextAnimation();
		});

		rightButton.on('click', (clicks, time) => {

			switch (clicks) {
				case 1: {
					switch(mode) {
						case 'clock': {
							// Special case, when in clock mode you will never
							// se the change when entering loop mode since 
							// the clock animation is the first...
							loopIndex = 1;
							mode = 'loop';
							break;
						}
						case 'loop': {
							mode = 'rain';
							break;
						}
						case 'rain': {
							mode = 'clock';
							break;
						}
					}

					runNextAnimation();
					break;
				}
			}

		});


		function runNextAnimation() {

			switch(mode) {
				case 'loop': {

					// Get next animation
					var Animation = loopAnimations[loopIndex];
					var animation = new Animation({pixels:pixels, duration:loopDuration, priority:'!'});

					loopIndex = (loopIndex + 1) % loopAnimations.length;

					runAnimation(animation);
					break;
				}
				case 'rain': {
					runAnimation(new MatrixAnimation({pixels:pixels, duration:-1, priority:'!'}));
					break;
				}
				case 'clock': {
					runAnimation(new ClockAnimation({pixels:pixels, duration:-1, priority:'!'}));
					break;
				}
				case 'off': {
					runAnimation(new ColorAnimation({pixels:pixels, color:'black', duration:-1, priority:'!'}));
					break;
				}
			}
		}

		function runAnimation(animation) {
			debug('Starting animation', animation.name); 
			animationQueue.enqueue(animation);

		}

		animationQueue.on('idle', () => {
			debug('Idle. Running next animation');
			runNextAnimation();
		});


		runNextAnimation();



	}


	module.exports.command  = 'loop [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

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
var PulseAnimation     = require('../scripts/pulse-animation.js')
var TextAnimation      = require('../scripts/text-animation.js');

function debug() {
}


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}

	function registerService() {
		return Promise.resolve();
	}


	function run(argv) {



		registerService().then(function() {


			var animations       = [ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation, WeatherAnimation];
			var upperButton      = new Button(13);
			var lowerButton      = new Button(6);
			var pixels           = new Neopixels.Pixels();

			var defaultDuration  = 10000;
			var animationIndex   = -1;
			var state            = 'on';
			var duration         = defaultDuration;
			var animationQueue   = new AnimationQueue();

			upperButton.on('click', (clicks) => {

				// Reset animation index
				animationIndex = 0;

				if (state == 'on') {
					runAnimation(new ColorAnimation({pixels:pixels, color:'black', duration:-1, priority:'!'}));
				}
				else {
					var Animation = animations[animationIndex % animations.length];
					runAnimation(new Animation({pixels:pixels, duration:duration, priority:'!'}));
				}

				state = (state == 'on') ? 'off' : 'on';
			});

			lowerButton.on('click', (clicks) => {
				switch (clicks) {
					case 1: {
						debug('Running next animation...');
						runNextAnimation();
						break;
					}
					case 2: {
						// Switch duration mode, loop or static
						duration = (duration < 0) ? defaultDuration : -1;
						animationIndex = 0;

						var Animation = animations[animationIndex % animations.length];
						runAnimation(new ColorAnimation({pixels:pixels, color:duration < 0 ? 'blue' : 'red', duration:500, priority:'!'}));
						runAnimation(new Animation({pixels:pixels, duration:duration, priority:'normal'}));
						break;
					}
					case 3: {
						runAnimation(new MatrixAnimation({pixels:pixels, duration:-1, priority:'!'}));
						break;
					}
				}
			});



			function runNextAnimation() {

				animationIndex = (animationIndex + 1) % animations.length;

				// Get next animation
				var Animation = animations[animationIndex % animations.length];
				var animation = new Animation({pixels:pixels, duration:duration, priority:'!'});

				runAnimation(animation);
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


		});


	}


	module.exports.command  = 'loop [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

#!/usr/bin/env node

var debug = require('../scripts/debug.js');

var Module = new (function () {
	function defineArgs(args) {
		args.option('help', { alias: 'h', describe: 'Displays this information' });
		args.option('speed', { alias: 's', describe: 'Specifies loop speed in seconds', default: 10 });

		args.wrap(null);

		args.check(function (argv) {
			return true;
		});
	}

	function run(argv) {
		debug('Starting animation loop...');

		var Neopixels = require('../scripts/neopixels.js');
		var AnimationQueue = require('rpi-animations').Queue;

		var ClockAnimation = require('../scripts/clock-animation.js');
		var CurrencyAnimation = require('../scripts/currency-animation.js');
		var CommodityAnimation = require('../scripts/commodity-animation.js');
		var IndexAnimation = require('../scripts/index-animation.js');
		var ColorAnimation = require('../scripts/color-animation.js');
		var MatrixAnimation = require('../scripts/matrix-animation.js');
		var WeatherAnimation = require('../scripts/weather-animation.js');

		var pixels = new Neopixels();

		var mode = 'loop';
		var animationQueue = new AnimationQueue();

		var loopAnimations = [ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation, WeatherAnimation];
		var loopDuration = parseFloat(argv.speed) * 1000;
		var loopIndex = 0;


		function runNextAnimation() {
			switch (mode) {
				case 'loop': {
					// Get next animation
					var Animation = loopAnimations[loopIndex];
					var animation = new Animation({ pixels: pixels, duration: loopDuration, priority: '!' });

					loopIndex = (loopIndex + 1) % loopAnimations.length;

					runAnimation(animation);
					break;
				}
				case 'rain': {
					runAnimation(new MatrixAnimation({ pixels: pixels, duration: -1, priority: '!' }));
					break;
				}
				case 'clock': {
					runAnimation(new ClockAnimation({ pixels: pixels, duration: -1, priority: '!' }));
					break;
				}
				case 'off': {
					runAnimation(new ColorAnimation({ pixels: pixels, color: 'black', duration: -1, priority: '!' }));
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

	module.exports.command = 'loop [options]';
	module.exports.describe = 'Run Neopixel Word Clock';
	module.exports.builder = defineArgs;
	module.exports.handler = run;
})();

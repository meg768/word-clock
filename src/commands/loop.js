#!/usr/bin/env node

var debug = require('../scripts/debug.js');

var Module = new (function () {
	function defineArgs(args) {
		args.option('help', { alias: 'h', describe: 'Displays this information' });

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
		var MatrixAnimation = require('../scripts/matrix-animation.js');
		var WeatherAnimation = require('../scripts/weather-animation.js');

		var pixels = new Neopixels();
		var animationQueue = new AnimationQueue();
		var loopAnimations = ['clock', 'index', 'clock', 'currency', 'clock', 'weather', 'clock', 'matrix', 'clock', 'commodity'];
		var loopIndex = 0;

		function runNextAnimation() {
			function createAnimation(name) {
				let duration = 60000;

				switch (name) {
					case 'index':
						return new IndexAnimation({ pixels: pixels, duration: duration, priority: '!' });
					case 'commodity':
						return new CommodityAnimation({ pixels: pixels, duration: duration, priority: '!' });
					case 'currency':
						return new CurrencyAnimation({ pixels: pixels, duration: duration, priority: '!' });
					case 'weather':
						return new WeatherAnimation({ pixels: pixels, duration: duration, priority: '!' });
					case 'matrix':
						return new MatrixAnimation({ pixels: pixels, duration: duration, priority: '!' });
				}

				return new ClockAnimation({ pixels: pixels, duration: duration * 10, priority: '!' });
			}

			// Get next animation
			var animationName = loopAnimations[loopIndex];
			var animation = createAnimation(animationName);

			loopIndex = (loopIndex + 1) % loopAnimations.length;

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
	}

	module.exports.command = 'loop [options]';
	module.exports.describe = 'Run Neopixel Word Clock';
	module.exports.builder = defineArgs;
	module.exports.handler = run;
})();

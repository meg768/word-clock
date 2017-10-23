#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');
var Button = require('../scripts/button.js');

var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('clock',     {alias:'c', describe:'Run clock animation',    default:undefined});
		args.option('weather',   {alias:'w', describe:'Run weather animation',  default:undefined});
		args.option('avanza',    {alias:'a', describe:'Run avanza animation',   default:undefined});
		args.option('matrix',    {alias:'m', describe:'Run matrix animation',   default:undefined});

		args.wrap(null);

		args.check(function(argv) {
			if (argv.clock == undefined && argv.weather == undefined && argv.avanza == undefined && argv.matrix == undefined)

				argv.clock   = true;
				argv.weather = true;
				argv.avanza  = true;
				argv.matrix  = true;

			return true;
		});
	}

	function registerService() {
		return Promise.resolve();
	}


	function run(argv) {


		var timer = new Timer();

		registerService().then(function() {
			var ClockAnimation     = require('../scripts/clock-animation.js');
			var WeatherAnimation   = require('../scripts/weather-animation.js');
			var CurrencyAnimation  = require('../scripts/currency-animation.js');
			var CommodityAnimation = require('../scripts/commodity-animation.js');
			var IndexAnimation     = require('../scripts/index-animation.js');
			var BlankAnimation     = require('../scripts/animation.js');
			//var MatrixAnimation    = require('../scripts/matrix-animation.js');

			var upperButton      = new Button(6);
			var lowerButton      = new Button(13);
			var strip            = new Strip();
			var animationIndex   = 0;
			var animations       = [];
			var currentAnimation = undefined;
			var state            = 0;

			//animations.push(new MatrixAnimation(strip));
			animations.push(new ClockAnimation(strip));
			animations.push(new CurrencyAnimation(strip));
			animations.push(new IndexAnimation(strip));
			animations.push(new CommodityAnimation(strip));
			animations.push(new WeatherAnimation(strip));

			upperButton.on('click', () => {

				if (currentAnimation) {
					currentAnimation.cancel();
				}

			});

			lowerButton.on('click', () => {

				if (currentAnimation) {
					currentAnimation.cancel();
				}


			});




			function disableAnimations() {
			}


			function enableAnimations() {
				disableAnimations();
				showAnimation();

			}

			function showAnimation(animation) {


                return new Promise((resolve, reject) => {

					if (animation == undefined)
						animation = new BlankAnimation(strip);
					// Get next animation
					var animation = currentAnimation = animations[animationIndex];

					animation.run().then(() => {
					})

					.catch((error) => {
						console.log(error);
					})

					.then(() => {
						animationIndex = (animationIndex + 1) % animations.length;
						currentAnimation = undefined;

						setTimeout(showAnimation, 0);
						resolve();

					})
                });

			}


			function showAnimation() {


                return new Promise((resolve, reject) => {

					// Get next animation
					var animation = currentAnimation = animations[animationIndex];

					animation.run().then(() => {
					})

					.catch((error) => {
						console.log(error);
					})

					.then(() => {
						animationIndex = (animationIndex + 1) % animations.length;
						currentAnimation = undefined;

						setTimeout(showAnimation, 0);
						resolve();

					})
                });

			}

			enableAnimations();


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

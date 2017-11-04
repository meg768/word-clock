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
			var ColorAnimation     = require('../scripts/color-animation.js');
			var AnimationQueue     = require('../scripts/animation-queue.js');

			var MatrixAnimation    = require('../scripts/matrix-animation.js');

			var animations       = [ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation, MatrixAnimation];
			var upperButton      = new Button(6);
			var lowerButton      = new Button(13);
			var strip            = new Strip();
			var animationIndex   = -1;
			var state            = 'on';
			var animationQueue   = new AnimationQueue();


			upperButton.on('click', (clicks) => {
				runNextAnimation();
			});

			lowerButton.on('click', () => {

				if (state == 'on') {
					animationQueue.enqueue(new ColorAnimation(strip, {color:'black', duration:-1, priority:'!'}));
				}
				else {
					var Animation = animations[animationIndex % animations.length];

					animationQueue.enqueue(new Animation(strip, {duration:-1, priority:'!'}));
				}

				state = (state == 'on') ? 'off' : 'on';
			});


			function runNextAnimation() {

				animationIndex = (animationIndex + 1) % animations.length;

				// Get next animation
				var Animation = animations[animationIndex % animations.length];
				var animation = new Animation(strip, {duration:-1, priority:'!'});

				animationQueue.enqueue(animation);
            }

			runNextAnimation();


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

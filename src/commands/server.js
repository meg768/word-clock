#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');
var Button = require('../scripts/button.js');
var WifiSetup = require('../scripts/wifi-setup.js');

var ClockAnimation     = require('../scripts/clock-animation.js');
var WeatherAnimation   = require('../scripts/weather-animation.js');
var CurrencyAnimation  = require('../scripts/currency-animation.js');
var CommodityAnimation = require('../scripts/commodity-animation.js');
var IndexAnimation     = require('../scripts/index-animation.js');
var ColorAnimation     = require('../scripts/color-animation.js');
var AnimationQueue     = require('../scripts/animation-queue.js');
var PulseAnimation     = require('../scripts/pulse-animation.js')
var MatrixAnimation    = require('../scripts/matrix-animation.js');

function debug() {
    console.log.apply(this, arguments);
}


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

//			var animations       = [PulseAnimation, ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation];
			var animations       = [ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation];
			var upperButton      = new Button(6);
			var lowerButton      = new Button(13);
			var strip            = new Strip({width:13, height:13});
			var animationIndex   = -1;
			var state            = 'on';
			var duration         = -1;
			var animationQueue   = new AnimationQueue();

			upperButton.on('click', (clicks) => {

				if (state == 'on') {
					// Reset animation index
					animationIndex = 0;

					// Turn off
					animationQueue.enqueue(new ColorAnimation(strip, {color:'black', duration:-1, priority:'!'}));
				}
				else {
					// Switch duration mode, loop or static
					duration = (duration < 0) ? 10000 : -1;

					var Animation = animations[animationIndex % animations.length];
					animationQueue.enqueue(new Animation(strip, {duration:duration, priority:'!'}));
				}

				state = (state == 'on') ? 'off' : 'on';
			});

			lowerButton.on('click', (clicks) => {
				if (clicks > 1) {
					animationQueue.enqueue(new MatrixAnimation(strip, {duration:-1, priority:'!'}));

				}
				else {
					runNextAnimation();

				}
			});



			function runNextAnimation() {

				animationIndex = (animationIndex + 1) % animations.length;

				// Get next animation
				var Animation = animations[animationIndex % animations.length];
				var animation = new Animation(strip, {duration:duration, priority:'!'});

				runAnimation(animation);
            }

			function runAnimation(animation) {
				animationQueue.enqueue(animation);

			}


			var setup = new WifiSetup('/boot/bluetooth/wifi.json');

			animationQueue.on('idle', () => {
				debug('Idle. Running next animation');
				runNextAnimation();
			});


			setup.on('connecting', () => {
				debug('Connecting to Wi-Fi...');
                runAnimation(new ColorAnimation(strip, {priority:'!', color:'orange', duration:-1}));
			});

            setup.on('discoverable', () => {
				debug('Raspberry now discoverable.');
                runAnimation(new ColorAnimation(strip, {priority:'!', color:'blue', duration:-1}));
			});

            setup.on('wifi-changed', () => {
			});

			setup.on('ready', () => {
				debug('Ready!');


				runNextAnimation();
			});


			setup.setup();


		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

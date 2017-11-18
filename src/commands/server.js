#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var Timer = require('yow/timer');
var Button = require('../scripts/button.js');

var Wifi = require('rpi-wifi-connection');
var Strip = require('rpi-neopixels').Strip;
var AnimationQueue = require('rpi-neopixels').AnimationQueue;
var Monitor = require('rpi-obex-monitor');

var Path = require('path');

var ClockAnimation     = require('../scripts/clock-animation.js');
var WeatherAnimation   = require('../scripts/weather-animation.js');
var CurrencyAnimation  = require('../scripts/currency-animation.js');
var CommodityAnimation = require('../scripts/commodity-animation.js');
var IndexAnimation     = require('../scripts/index-animation.js');
var ColorAnimation     = require('../scripts/color-animation.js');
var PulseAnimation     = require('../scripts/pulse-animation.js')
var MatrixAnimation    = require('../scripts/matrix-animation.js');
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


		var timer = new Timer();

        if (argv.debug) {
            debug = function() {
                console.log.apply(this, arguments);
            }
        }

		registerService().then(function() {

			var animations       = [ClockAnimation, IndexAnimation, CommodityAnimation, CurrencyAnimation];
			var upperButton      = new Button(6);
			var lowerButton      = new Button(13);
			var strip            = new Matrix({width:13, height:13, debug:argv.debug});
            var wifi             = new Wifi({debug:argv.debug});
            var monitor          = new Monitor({debug:argv.debug});

			var animationIndex   = -1;
			var state            = 'on';
			var duration         = -1;
			var animationQueue   = new AnimationQueue();

			upperButton.on('click', (clicks) => {

				if (state == 'on') {
					// Reset animation index
					animationIndex = 0;

					// Turn off
					runAnimation(new ColorAnimation(strip, {color:'black', duration:-1, priority:'!'}));
				}
				else {
					// Switch duration mode, loop or static
					duration = (duration < 0) ? 10000 : -1;

					var Animation = animations[animationIndex % animations.length];
					runAnimation(new Animation(strip, {duration:duration, priority:'!'}));
				}

				state = (state == 'on') ? 'off' : 'on';
			});

			lowerButton.on('click', (clicks) => {
				if (clicks > 1) {

					runAnimation(new MatrixAnimation(strip, {duration:-1, priority:'!'}));

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

			animationQueue.on('idle', () => {
				debug('Idle. Running next animation');
				runNextAnimation();
			});


            monitor.on('upload', (fileName, content) => {

                // The file has already been deleted.
                // File contents is in the contents parameter.
                debug('File uploaded', Path.join(monitor.path, fileName));

                try {
                    var json = JSON.parse(content);

                    if (json.ssid != undefined) {
                        debug('Connecting to network', json.ssid, '...');
                        runAnimation(new TextAnimation(strip, {priority:'!', color:'blue', text:'PLEASE WAIT', duration:-1}));

                        wifi.connect({ssid:json.ssid, psk:json.password}).then(() => {
                            debug('Connected to network.');
                            runNextAnimation();
                        })
                        .catch((error) => {
                            runAnimation(new PulseAnimation(strip, {priority:'!', color:'blue', duration:-1}));
                            console.log(error);
                        });

                    }
                }
                catch(error) {
                    debug('Invalid file contents');
                }
            });

            monitor.enableBluetooth();

            // Start monitoring. Stop by calling stop()
            monitor.start();

            wifi.getState().then((connected) => {
                if (connected) {
                    runNextAnimation();
                }
                else {
                    runAnimation(new TextAnimation(strip, {priority:'!', color:'blue', text:'BLUETOOTH ON', duration:-1}));
                }

            })
            .catch(() => {
                runAnimation(new TextAnimation(strip, {priority:'!', color:'blue', text:'BLUETOOTH ON', duration:-1}));

            })



		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

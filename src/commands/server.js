#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var prefixLogs = require('yow/logs').prefix;
var config = require('../scripts/config.js');
var io = require('socket.io-client');
var Timer = require('yow/timer');


var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('service',   {alias:'n', describe:'Service name', default:config.service.url});
		args.option('interval',  {alias:'i', describe:'Upådate interval', default:10});

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

		prefixLogs();

		registerService().then(function() {
			var Strip = require('../scripts/neopixel-strip.js');
			var Display = require('../scripts/display.js');
			var ClockAnimation = require('../scripts/clock-animation');
			var WeatherAnimation = require('../scripts/weather-animation');

			var strip = new Strip();
			var display = new Display(strip);
			var animations = [new ClockAnimation(display), new WeatherAnimation(display)];
			var socket = io.connect(argv.service);
			var animationIndex = 0;


			function disableClock() {
				timer.cancel();
			}

			function enableClock() {
				disableClock();
				showClock();

			}


			function showClock() {


                return new Promise(function(resolve, reject) {

					// Get next animation
					var animation = animations[animationIndex];

					timer.cancel();

					animation.run().then(function() {
						animationIndex = (animationIndex + 1) % animations.length;
						timer.setTimer(1000 * argv.interval, showClock);
						resolve();
					})

					.catch(function() {
						console.log(error);
						resolve();
					})
                });

			}


			socket.on('connect', function() {
				debug('Connected to socket server.');

				// Register the service
				socket.emit('i-am-the-provider');

				enableClock();

			});

			socket.on('disconnect', function() {
				debug('Disconnected from socket server.');
				disableClock();
			});


			socket.on('enableClock', function(fn) {
				enableClock();

				if (isFunction(fn))
					fn({status:'OK'});
			});

			socket.on('disableClock', function(fn) {
				disableClock();

				if (isFunction(fn))
					fn({status:'OK'});
			});

			socket.on('reset', function(fn) {
				if (isFunction(fn))
					fn({status:'OK'});
			});

			socket.on('colorize', function(options, fn) {
				disableClock();

				strip.colorize(options).then(function(reply) {
					socket.emit('color-changed', options);

					if (isFunction(fn))
						fn({status:'OK', reply:reply});
				})

				.catch(function(error) {
					console.error(error);

					if (isFunction(fn))
						fn({error: error.message});
				});
			})

		});


	}


	module.exports.command  = 'server [options]';
	module.exports.describe = 'Run Neopixel word clock';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

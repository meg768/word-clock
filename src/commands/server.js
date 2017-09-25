#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var io = require('socket.io-client');
var Timer = require('yow/timer');
var Strip = require('../scripts/neopixel-strip.js');

var Module = new function() {

	function debug() {
		console.log.apply(this, arguments);
	}

	function defineArgs(args) {

		args.help('help').alias('help', 'h');

		args.option('service',   {alias:'n', describe:'Service name',           default:process.env.SERVICE_NAME});
		args.option('clock',     {alias:'c', describe:'Run clock animation',    default:undefined});
		args.option('weather',   {alias:'w', describe:'Run weather animation',  default:undefined});
		args.option('avanza',    {alias:'a', describe:'Run avanza animation',   default:undefined});
		args.option('matrix',    {alias:'m', describe:'Run matrix animation',   default:undefined});

		args.wrap(null);

		args.check(function(argv) {
			if (argv.clock == undefined && argv.weather == undefined && argv.avanza == undefined && argv.matrix == undefined)
				argv.clock = true;

			return true;
		});
	}

	function registerService() {
		return Promise.resolve();
	}


	function run(argv) {


		var timer = new Timer();

		registerService().then(function() {
			var ClockAnimation   = require('../scripts/clock-animation.js');
			var WeatherAnimation = require('../scripts/weather-animation.js');
			var AvanzaAnimation  = require('../scripts/avanza-animation.js');
			var MatrixAnimation  = require('../scripts/matrix-animation.js');

			var strip          = new Strip();
			var socket         = io.connect(argv.service);
			var animationIndex = 0;
			var animations     = [];

			if (argv.matrix)
				animations.push(new MatrixAnimation(strip));

			if (argv.clock)
				animations.push(new ClockAnimation(strip));

			if (argv.avanza)
				animations.push(new AvanzaAnimation(strip));

			if (argv.weather)
				animations.push(new AvanzaAnimation(strip));



			function disableAnimations() {
				timer.cancel();
			}

			function enableAnimations() {
				disableAnimations();
				showAnimation();

			}


			function showAnimation() {


                return new Promise(function(resolve, reject) {

					// Get next animation
					var animation = animations[animationIndex];

					timer.cancel();

					console.log('Starting animation "', animation.name, '"...');

					animation.run().then(function() {
						animationIndex = (animationIndex + 1) % animations.length;
						timer.setTimer(0, showAnimation);
						resolve();
					})

					.catch(function(error) {
						console.log(error);
						resolve();
					})
                });

			}


			socket.on('connect', function() {
				debug('Connected to socket server.');

				// Register the service
				socket.emit('i-am-the-provider');

				enableAnimations();

			});

			socket.on('disconnect', function() {
				debug('Disconnected from socket server.');
				disableAnimations();
			});


			socket.on('enableAnimations', function(fn) {
				enableAnimations();

				if (isFunction(fn))
					fn({status:'OK'});
			});

			socket.on('disableAnimations', function(fn) {
				disableAnimations();

				if (isFunction(fn))
					fn({status:'OK'});
			});

			socket.on('reset', function(fn) {
				if (isFunction(fn))
					fn({status:'OK'});
			});

			socket.on('colorize', function(options, fn) {
				disableAnimations();

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

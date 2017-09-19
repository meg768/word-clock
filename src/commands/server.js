#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var isObject = require('yow/is').isObject;
var isFunction = require('yow/is').isFunction;
var prefixLogs = require('yow/logs').prefix;
var config = require('../scripts/config.js');
var io = require('socket.io-client');
//var SkyBightness = require('sky-brightness');
//var SkyBightness = require('../scripts/sky-brightness.js');

var tellTime = require('../scripts/tell-time.js');
var Layout   = require('../scripts/layout.js');

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


		var timer = undefined;

		prefixLogs();

		registerService().then(function() {
			var Strip = require('../scripts/neopixel-strip.js');

			var strip = new Strip({
				address : argv.address,
				length  : argv.size
			});

			var socket = io.connect(argv.service);

			//strip.initialize();

			function disableClock() {
				if (timer != undefined) {
					console.log('Disabling clock...');
					clearTimeout(timer);
					timer = undefined;
				}
			}

			function enableClock() {
				disableClock();
				showClock();

                timer = setInterval(showClock, 1000 * argv.interval);
			}

			function showClock() {


                return new Promise(function(resolve, reject) {
					var now = new Date();
					var TellTime = require('../scripts/weather.js')
					var Layout = require('../scripts/layout.js');
					var layout = new Layout();
					var tellTime = new TellTime();

					tellTime.getText().then(function(time) {
						var timeText = time.map(function(item) {
							return item.text;
						}).join(' ');

						var words = layout.getLayout(timeText);
						var promise = strip.clear();

						console.log(time);

						var hue = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));

						words.forEach(function(word) {
							promise = promise.then(function() {
								return strip.colorize({
									offset     : word.offset,
									length     : word.length,
									color      : sprintf('hsl(%d, 100%%, 50%%)', hue)
								});
							});
						});

						promise = promise.then(function() {
							return strip.show(16);
						})
						.catch(function(error) {
							console.log(error);
						})
	                    .then(function() {
	                        resolve();
	                    })


					})
					.catch(function(error) {
						reject(error);
					});


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
	module.exports.describe = 'Run Neopixel lamp server';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

#!/usr/bin/env node

require('dotenv').config();

var App = function() {


	function run() {
		try {
			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]')

			args.help();

			args.option('size',      {alias:'S', describe:'Size of the Neopixel strip', default:process.env.NEOPIXEL_STRIP_LENGTH});
			args.option('debug',     {alias:'D', describe:'Debug mode', default:false});

			args.command(require('./src/commands/loop.js'));
			args.command(require('./src/commands/rain.js'));
			args.command(require('./src/commands/clock.js'));
			args.command(require('./src/commands/boring.js'));
			args.command(require('./src/commands/word.js'));
			args.command(require('./src/commands/weather.js'));
			args.command(require('./src/commands/index.js'));
			args.command(require('./src/commands/quotes.js'));

			args.wrap(null);
			args.demand(1);

			args.argv;
		}

		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	};

	process.on('unhandledRejection', (reason, p) => {
	  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
	  // application specific logging, throwing an error, or other logic here
	});

	run();
};

module.exports = new App();

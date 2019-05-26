#!/usr/bin/env node

require('dotenv').config();

var sprintf    = require('yow/sprintf');
var prefixLogs = require('yow/logs').prefix;

var App = function() {


	function run() {
		try {
			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]')

			args.help();

			args.option('size',      {alias:'S', describe:'Size of the Neopixel strip', default:process.env.NEOPIXEL_STRIP_LENGTH});
			args.option('debug',     {alias:'D', describe:'Debug mode', default:false});

			args.command(require('./src/commands/server.js'));
			args.command(require('./src/commands/rain.js'));

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

	prefixLogs();
	run();
};

module.exports = new App();

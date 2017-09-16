#!/usr/bin/env node

var sprintf    = require('yow/sprintf');
var prefixLogs = require('yow/logs').prefix;
var config     = require('./src/scripts/config.js');

var App = function() {


	function run() {
		try {
			var args = require('yargs');

			args.usage('Usage: $0 <command> [options]')

			args.help();

			args.option('length',    {alias:'L', describe:'Length to colorize', default:config.strip.length});
			args.option('address',   {alias:'A', describe:'I2C bus address', default:config.i2c.address});
			args.option('debug',     {alias:'D', describe:'Debug mode', default:false});

			//args.command(require('./src/commands/server.js'));
			args.command(require('./src/commands/test.js'));
			args.command(require('./src/commands/colorize.js'));

			args.wrap(null);
			args.demand(1);

			args.argv;

		}
		catch(error) {
			console.log(error.stack);
			process.exit(-1);
		}

	};

	prefixLogs();
	run();
};

module.exports = new App();

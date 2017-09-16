#!/usr/bin/env node

var sprintf = require('yow/sprintf');
var Layout = require('./src/layout.js');

var App = function() {


	function run(argv) {
		console.log(argv);

		var layout = new Layout(argv);
		var foo = layout.getLayout(argv.text);
        console.log(JSON.stringify(foo, null, '\t'));


	}

	try {
		var args = require('yargs');

		args.usage('Usage: $0 <command> [options]')

		args.help();


		args.wrap(null);

		run(args.argv);

	}
	catch(error) {
		console.log(error.stack);
		process.exit(-1);
	}
};

module.exports = new App();

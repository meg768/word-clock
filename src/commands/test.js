#!/usr/bin/env node

var Neopixels = require('../scripts/neopixels.js');
var WordAnimation = require('../scripts/word-animation.js');
var debug = require('../scripts/debug.js');
var Clock = require('../scripts/clock.js');

class Animation extends WordAnimation {

    constructor(options) {

        super({name:'Clock Test Animation', renderFrequency: 100, ...options});
		this.date = new Date();

	}

    getWords() {
		this.date.setMinutes(this.date.getMinutes() + 30);

        var clock = new Clock(this.date);
        var words = [];
        var color = clock.getColor();
        var time  = clock.getTime();

        time.split(' ').forEach((word) => {
            words.push({word:word, color:color});
        });

        return words;
    }

}


var Module = new function() {


	function defineArgs(args) {

		args.help('help').alias('help', 'h');
		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}

	function run(argv) {
		var animation = new Animation({pixels: new Neopixels(), duration:-1, priority:'!', debug:debug});
		return animation.run();


	}

	module.exports.command  = 'test [options]';
	module.exports.describe = 'Test Animation';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

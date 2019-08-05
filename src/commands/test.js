#!/usr/bin/env node

var Neopixels = require('../scripts/neopixels.js');
var WordAnimation = require('../scripts/word-animation.js');
var debug = require('../scripts/debug.js');
var Clock = require('../scripts/clock.js');

class Animation extends WordAnimation {

    constructor(options) {

        super({name:'Clock Test Animation', renderFrequency: 100, ...options});
		this.date = new Date("2010-01-01 19:30");
		this.index = 0;
	}

    getWords() {
		this.index++;

		var now = new Date();
		now.setTime(this.date.getTime() + (this.index * 60 * 1000));

        var clock = new Clock(now);
        var words = [];
        var color = clock.getColor();
        var time  = clock.getTime();

		debug(now, '*'+time+'*');

        time.split(' ').forEach((word) => {
            words.push({word:word, color:color});
        });

		debug(words);
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

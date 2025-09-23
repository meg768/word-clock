#!/usr/bin/env node
var Neopixels = require('../scripts/neopixels.js');
var ClockAnimation = require('../scripts/clock-animation.js');
var WordAnimation = require('../scripts/word-animation.js');
var debug = require('../scripts/debug.js');
var Clock = require('../scripts/clock.js');


class SpeedAnimation extends WordAnimation {

    constructor(options) {

        super({name:'Clock Test Animation', renderFrequency: 100, ...options});
		this.date = new Date();
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
		var day   = clock.getDay();

        time.split(' ').forEach((word) => {
            words.push({word:word, color:'red'});
        });

		words.push({ word: "LÖ", color: color });

        return words;
    }

}


var Module = new function() {


	function defineArgs(args) {

		args.option('help', {alias:'h', describe:'Displays this information'});
		args.option('test', {alias:'t', describe:'Test clock'});

		args.wrap(null);

		args.check(function(argv) {
			return true;
		});
	}


	function run(argv) {

		var animation = null;

		if (argv.test)
			animation = new SpeedAnimation({pixels: new Neopixels(), duration:-1, priority:'!', debug:debug});
		else
			animation = new ClockAnimation({pixels: new Neopixels(), duration:-1, priority:'!', debug:debug});

		return animation.run();
	}

	module.exports.command  = 'clock [options]';
	module.exports.describe = 'Display current time';
	module.exports.builder  = defineArgs;
	module.exports.handler  = run;

};

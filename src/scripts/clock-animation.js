
var Clock = require('./clock.js');
var WordAnimation = require('./word-animation.js');

module.exports = class extends WordAnimation {

    constructor(options) {
        super({name:'Clock Animation', renderFrequency: 15 * 1000, ...options});
    }

    getWords() {
        var clock = new Clock(new Date());
        var words = [];
        var color = clock.getColor();
        var time  = clock.getTime();
        var day   = clock.getDay();

        time.split(' ').forEach((word) => {
            words.push({word:word, color:color});
        });

        // Hack - make the day of week light the last row
        words.push({ word: 'NIKK', color: 'black' });

        // Add the day of the week

        words.push({ word: day, color: color });

        return words;
    }

}


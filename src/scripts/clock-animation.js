
var sprintf = require('yow/sprintf');

var Animation = require('./animation.js');
var Layout    = require('./layout.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip) {
        super(strip);

        this.name = 'Clock';
    }


    run() {

        var self = this;

        return new Promise(function(resolve, reject) {
            displayTime();
            setTimeout(resolve, 60000);
        });
    }

    displayTime() {
        var self = this;

        var pixels  = new Pixels(self.strip.width, self.strip.height);
        var display = new Layout();
        var text    = this.getTime();
        var color   = this.getColor();

        var words   = display.lookupText(text);

        words.forEach((word) => {
            for (var i = 0; i < word.text.length; i++) {
                pixels.setPixelHSL(word.x + i, word.y, hue, 100, 50);

            }
        });

        self.strip.render(pixels.getPixels(), {fadeIn:25});

    }

    getColor() {
        var now = new Date();
        return Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
    }

    getTime() {

        var minutes = {
            0  : '',
            1  : '',
            2  : 'LITE ÖVER ',
            3  : 'LITE ÖVER ',
            5  : 'FEM ÖVER ',
            10 : 'TIO ÖVER ',
            15 : 'KVART ÖVER ',
            20 : 'TJUGO ÖVER ',
            25 : 'FEM I HALV ',
            27 : 'LITE I HALV ',
            28 : 'LITE I HALV ',
            30 : 'HALV ',
            32 : 'LITE ÖVER HALV ',
            33 : 'LITE ÖVER HALV ',
            35 : 'FEM ÖVER HALV ',
            40 : 'TJUGO I ',
            45 : 'KVART I ',
            50 : 'TIO I ',
            55 : 'FEM I ',
            57 : 'LITE I ',
            58 : 'LITE I ',
            59 : ''
        };

        var hours = {
            0  : 'TOLV',
            1  : 'ETT',
            2  : 'TVÅ',
            3  : 'TRE',
            4  : 'FYRA',
            5  : 'FEM',
            6  : 'SEX',
            7  : 'SJU',
            8  : 'ÅTTA',
            9  : 'NIO',
            10 : 'TIO',
            11 : 'ELVA',
            12 : 'TOLV'
        };


        var now = new Date();

        var minute = now.getMinutes();
        var hour   = now.getHours() % 12;

        if (minutes[minute] == undefined) {
            minute = 5 * Math.floor((minute + 2.5) / 5);
        }

        if (minute >= 25)
            hour += 1;

        return sprintf('%s%s', minutes[minute], hours[hour]);
    }
}

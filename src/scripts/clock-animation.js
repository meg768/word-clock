
var sprintf = require('yow/sprintf');

var Animation = require('./animation.js');
var Layout    = require('./layout.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name       = 'Clock';
        this.lastRender = 0;

    }



    tick() {
        var now = new Date();

        if (now - this.lastRender > 30000) {
            this.render();
        }

    }

    start() {
        return new Promise((resolve, reject) => {
            super.start().then(() => {
                this.render();
                resolve();
            })
            .catch((error) => {
                reject(error);
            })
        });
    }

    render(options) {
        var now = new Date();

        if (now - this.lastRender > 30000) {
            console.log('Redrawing clock');

            var pixels  = new Pixels(this.strip.width, this.strip.height);
            var display = new Layout();
            var text    = this.getTime();
            var hue     = this.getHue();

            var words   = display.lookupText(text);

            words.forEach((word) => {
                for (var i = 0; i < word.text.length; i++) {
                    pixels.setPixelHSL(word.x + i, word.y, hue, 100, 50);

                }
            });

            this.strip.render(pixels.getPixels(), options);
            this.lastRender = new Date();
        }


    }

    getHue() {
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

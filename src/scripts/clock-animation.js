
var sprintf = require('yow/sprintf');

var Animation = require('./animation.js');


module.exports = class extends Animation {


    constructor(display) {
        super(display);
    }

    run() {
        console.log('Displaying time.');
        return this.displayText(this.getText());
    }


    getText() {

        return new Promise(function(resolve, reject) {
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
                12 : 'TOLV',
            };


            var now = new Date();

            var minute = now.getMinutes();
            var hour   = now.getHours() % 12;
            var hue    = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));


            if (minutes[minute] == undefined) {
                minute = 5 * Math.floor((minute + 2.5) / 5);
            }

            if (minute >= 25)
                hour += 1;

            resolve(sprintf('%s%s', minutes[minute], hours[hour]).split(' ').map(function(word){
                return {
                    text : word,
                    color: sprintf('hsl(%d, 100%%, 50%%)', hue)
                }
            }));


        });

    }
}

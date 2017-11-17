
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Strip     = require('rpi-neopixels').Strip;
var Animation = require('rpi-neopixels').Animation;
var Pixels  = require('rpi-neopixels').Pixels;

var Color     = require('color');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.options = Object.assign({}, {interval:500, delay:500}, this.options);
        this.name = 'Pulse Animation';
        this.renderFrequency = this.options.interval;
        this.color = Color('red').rgbNumber();
        this.tick  = 0;

        if (isString(this.options.color)) {
            try {
                this.color = Color(this.options.color).rgbNumber();
            }
            catch (error) {
                console.log('Invalid color value.');

            }
        }

        debug('New color animation', this.options);

    }


    start() {
        this.tick = 0;
        return super.start();
    }

    render() {
        try {
            var color = (this.tick % 2) == 0 ? this.color : 0;

            this.pixels.fill(color);
            this.pixels.render({transition:'fade', duration:this.options.delay});

            this.tick++;
        }

        catch(error) {
            console.log(error);
        }
    }


}

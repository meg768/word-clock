
var sprintf  = require('yow/sprintf');
var isString = require('yow/is').isString;

var Animation = require('./animation.js');
var Strip     = require('./neopixel-strip.js');
var Pixels    = require('./pixels.js');
var Color     = require('color');
var Sleep     = require('sleep');

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
            debug('Rendering pulse', this.color);
            this.pixels.fill((this.tick % 2) == 0 ? this.color : 0);
            this.strip.render(this.pixels.getPixels(), {fadeIn:this.options.delay});

            this.tick++;
        }

        catch(error) {
            console.log(error);
        }
    }


}

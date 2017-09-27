
var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
var Animation = require('./animation.js');
var Pixels    = require('./pixels.js');
var Layout    = require('./layout.js');


module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name = 'Text';
    }


    run() {
        var pixels   = new Pixels(this.strip.width, this.strip.height);
        var display  = new Layout();
        var options  = this.options;
        var strip    = this.strip;

        return new Promise((resolve, reject) => {

            var layout    = display.lookupLetters(options.text);
            var hue       = Color(options.color).hue();
            var letters   = options.text.split('');
            var positions = [];

            letters.forEach((letter) => {
                var position = layout[letter].shift();
                layout[letter].push(position);

                positions.push(position);
            });

            pixels.fill(0);
            strip.render(pixels.getPixels(), {fadeIn:10});

            positions.forEach((position) => {
                pixels.setPixelHSL(position.x, position.y, hue, 100, 50);
                strip.render(pixels.getPixels(), {fadeIn:6});
                pixels.setPixelHSL(position.x, position.y, hue, 100, 0);
            });

            strip.render(pixels.getPixels(), {fadeIn:10});

            resolve();
        });

    }

}

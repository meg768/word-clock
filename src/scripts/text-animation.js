
var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
var Animation = require('./animation.js');
var Pixels    = require('./pixels.js');


module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name    = 'Text';
        this.options = options;
    }



    run() {
        var self   = this;
        var pixels = new Pixels(self.strip.width, self.strip.height);

        return new Promise((resolve, reject) => {

            console.log(this.options);
            pixels.clear();

            var color = Color(self.options.color).rgbValue();

            for (var y = 0; y < pixels.height; y++) {
                for (var x = 0; x < pixels.width; x++) {
                    pixels.setPixelColor(x, y, color);
                }
            }

            self.strip.render(pixels.getPixels(), {fadeIn:20});

            resolve();
        });

    }
}

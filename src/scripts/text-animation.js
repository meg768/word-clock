
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

        this.name    = 'Text';
        this.options = options;
    }



    run() {
        var pixels  = new Pixels(this.strip.width, this.strip.height);
        var layout  = new Layout();
        var options = this.options;

        return new Promise((resolve, reject) => {

            console.log(options);

            var letters = layout.lookupLetters(options.text);
            console.log('letters', letters);
            pixels.clear();

            var color = Color(options.color).rgbNumber();

            for (var y = 0; y < pixels.height; y++) {
                for (var x = 0; x < pixels.width; x++) {
                    pixels.setPixel(x, y, color);
                }
            }

            this.strip.render(pixels.getPixels(), {fadeIn:20});

            resolve();
        });

    }
}

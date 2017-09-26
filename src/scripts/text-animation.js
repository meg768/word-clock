
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
        var pixels   = new Pixels(this.strip.width, this.strip.height);
        var display  = new Layout();
        var options  = this.options;
        var strip    = this.strip;

        return new Promise((resolve, reject) => {

            console.log(options);

            var layout  = display.lookupLetters(options.text);
            var color   = Color(options.color).rgbNumber();
            var letters = options.text.split('');

            console.log('letters', letters);

            pixels.fill(0);
            strip.render(pixels.getPixels(), {fadeIn:20});

            letters.forEach((letter) => {
                var position = random(layout[letter]);

                console.log(position);
                pixels.setPixel(position.x, position.y, color);
                strip.render(pixels.getPixels(), {fadeIn:8});
                pixels.setPixel(position.x, position.y, 0);
            });

            pixels.clear();
            strip.render(pixels.getPixels(), {fadeIn:20});

            resolve();
        });

    }
}

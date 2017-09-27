
var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
var Animation = require('./animation.js');
var Pixels    = require('./pixels.js');
var Layout    = require('./layout.js');


class Star {

    constructor(x, y, index, hue) {
        this.x = x;
        this.y = y;
        this.luminance = 0;
        this.index = index;
        this.hue = hue;
        this.loop = 0;
        this.finished = false;
    }

    draw(pixels) {
        console.log(this.index, this.x, this.y, this.hue, this.luminance);
        pixels.setPixelHSL(this.x, this.y, this.hue, 100, this.luminance);
    }


    idle() {
        if (this.index == this.loop) {
            this.luminance = 50;
        }
        else {
            this.luminance = this.luminance * 0.2;
        }

        if (this.loop >= this.index && this.luminance < 1)
            this.finished = true;

        this.loop++;
    }
}

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
            var hue     = Color(options.color).hue();
            var letters = options.text.split('');
            var stars   = [];

            console.log('letters', letters);
            console.log('layout', layout);

            pixels.fill(0);
            strip.render(pixels.getPixels(), {fadeIn:20});

            for (var index = 0; index < letters.length; index++) {
                var position = random(layout[letters[index]]);
                var star = new Star(position.x, position.y, index, hue);

                stars.push(star);
            }

            for (;;) {
                for (var index = 0; index < stars.length; index++) {
                    stars[index].idle();
                    stars[index].draw(pixels);
                }

                strip.render(pixels.getPixels());

                if (stars[stars.length - 1].finished)
                    break;
            }


//            pixels.clear();
//            strip.render(pixels.getPixels(), {fadeIn:20});

            resolve();
        });

    }
}

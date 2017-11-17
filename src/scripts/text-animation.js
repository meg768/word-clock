var Strip     = require('rpi-neopixels').Strip;
var Animation = require('rpi-neopixels').Animation;
var Pixels  = require('rpi-neopixels').Pixels;

var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');

var Layout    = require('./layout.js');

function debug() {
    console.log.apply(this, arguments);
}

module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, Object.assign({text:'ABCDEFG', color:'blue'}, options));

        this.name = 'Text';
        this.color = 'blue';
        this.renderFrequency = 500;

        var display  = new Layout();

        this.layout  = display.lookupLetters(this.options.text);
        this.letters = this.options.text.split('');
        this.index   = 0;

		try {
			this.color = Color(this.options.color).rgbNumber();
		}
		catch(error) {
			console.log(error);
			this.color = 'red';
		}
    }


    render() {
        var strip  = this.strip;
        var pixels = this.pixels;
        var position = undefined;

        if (this.index < this.letters.length) {
            var letter = this.letters[this.index++];
            var positions = this.layout[letter];

            if (positions.length > 0)
                position = random(positions);

        }
        else {
            this.index = 0;
        }

        if (position) {

            pixels.fill(0);
            pixels.render({transition:'fade', duration:100});

            pixels.setPixel(position.x, position.y, this.color);
            pixels.render({transition:'fade', duration:100});

        }
        else {
            pixels.fill(0);
            pixels.render({transition:'fade', duration:100});
            pixels.render({transition:'fade', duration:100});
    }


    }

}

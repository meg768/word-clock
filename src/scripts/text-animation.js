var Animation = require('./animation');

var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
var debug     = require('./debug.js');
var Layout    = require('./layout.js');


module.exports = class extends Animation {


    constructor(options) {
        var {pixels, text = 'ABCDEFG', color = 'blue', ...other} = options;

        super(other);

        this.pixels = pixels;
        this.name = 'Text Animation';
        this.color = color;
        this.text = text;
        this.renderFrequency = 500;

        var display  = new Layout();

        this.layout  = display.lookupLetters(this.text);
        this.letters = this.text.split('');
        this.index   = 0;

		try {
			this.color = Color(this.color).rgbNumber();
		}
		catch(error) {
			console.log(error);
			this.color = 'red';
		}
    }


    render() {
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

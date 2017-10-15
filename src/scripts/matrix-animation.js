
var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
var Timer     = require('yow/timer');
var Animation = require('./animation.js');

var Pixels  = require('./pixels.js');

class Worm {

    constructor(width, height, column) {
        this.column = column;
        this.height = height;
        this.width  = width;

        this.reset();


    }

    draw(pixels) {
        var self   = this;
		var x      = self.column;
		var y      = self.row;
        var length = self.length;

        pixels.setPixelHSL(x, y--, self.hue, 100, 70);

		for (var i = 0; i <= length; i++) {
			// Calculate brightness
            var luminanceIndex = (length - i) / length;

            pixels.setPixelHSL(x, y--, self.hue, 100, Math.floor(luminanceIndex * 50));
		}
	}

    reset() {
        var self   = this;
        var now    = new Date();

        self.length = Math.floor(self.height * 0.1 + self.height * 0.9 * random(100) / 100);
		self.row    = -self.length;
        self.loops  = random([0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4]);
		self.ticks  = 0;
        self.hue    = Math.floor(360 * (((now.getHours() % 12) * 60) + now.getMinutes()) / (12 * 60));
	}


    idle() {
        var self = this;

		self.ticks++;

		if (self.ticks >= self.loops) {
			self.ticks = 0;
			self.row++;

			if (self.row - self.length > self.height)
				self.reset();

		}

	}

}


module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.pixels = new Pixels(this.strip.width, this.strip.height);
        this.name   = 'Matrix';
        this.worms  = [];

    }


    start() {

        return new Promise((resolve, reject) => {
            super.start().then(() => {

                var worms = [];

                for (var i = 0; i < this.strip.width; i++) {
                    worms.push(new Worm(this.strip.width, this.strip.height, i));
                }

                this.pixels.clear();
                this.worms = worms;

                resolve();

            })

            .catch((error) => {
                reject(error);
            });
        });
    }

    tick() {
        for (var i = 0; i < this.worms.length; i++) {
            this.worms[i].draw(this.pixels);
            this.worms[i].idle();
        }

        this.strip.render(this.pixels.getPixels());
    }


}

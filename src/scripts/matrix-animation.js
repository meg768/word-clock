
var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
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

		for (var i = 0; i < length; i++) {
			// Calculate brightness
			var luminance  = 100 - (100 * i) / length;

			if (luminance < 0)
				luminance = 0;

			if (luminance > 100)
				luminance = 100;

            pixels.setPixelHSL(x, y--, self.hue, 100, luminance / 4);
		}
	}

    reset() {
        var self   = this;
        var now    = new Date();

        self.length = self.height * 0.1 + self.height * 1.1 * random(100) / 100;
		self.row    = -random(0, self.height * 2);
        self.loops  = random(3);
		self.ticks  = 0;
        self.lead   = random([60]);
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

        this.name = 'Matrix';

    }



    run() {
        var self = this;

        return new Promise(function(resolve, reject) {

            var pixels = new Pixels(self.strip.width, self.strip.height);
            var start = new Date();
            var worms = [];

            for (var i = 0; i < self.strip.width; i++) {
                var worm = new Worm(self.strip.width, self.strip.height, i);
                worms.push(worm);
            }

            var now = new Date();

            function loop() {
                pixels.clear();

                if (now.getTime() - start.getTime() < 1000 * 60) {

                    for (var i = 0; i < self.strip.width; i++) {
            			worms[i].draw(pixels);
            			worms[i].idle();
            		}

                    self.strip.render(pixels.getPixels());

                    if (!self.cancelled)
                        setTimeout(loop, 0);

                }
            }

            loop();
/*
            while (!self.cancelled) {
                pixels.clear();

                var now = new Date();

                if (now.getTime() - start.getTime() > 1000 * 60)
                    break;

                for (var i = 0; i < self.strip.width; i++) {
        			worms[i].draw(pixels);
        			worms[i].idle();
        		}

                self.strip.render(pixels.getPixels());

            }
*/
            pixels.clear();
            self.strip.render(pixels.getPixels(), {fadeIn:20});

            resolve();
        });

    }
}


/*
function test() {
    var module = new Module();

    module.getText().then(function(text) {
        console.log(text);
    })
    .catch(function(error) {
        console.log(error);
    });

}

test();

*/

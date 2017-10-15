
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');
var Timer   = require('yow/timer');
var Events  = require('events')


module.exports = class Animation {


    constructor(strip, options) {
        this.strip     = strip;
        this.name      = 'None';
        this.options   = options || {};
        this.cancelled = false;
        this.timeout   = 60000;
        //this.pixels    = new Pixels(this.strip.width, this.strip.height);

    }


    tick() {

    }

    start() {
        var self = this;

        console.log('Starting animation', self.name);

        self.cancelled = false;

        return Promise.resolve();
    }

    loop() {
        var self = this;

        console.log('Running loop', self.name);

        return new Promise((resolve, reject) => {

            var start = new Date();

            function loop() {

                var now = new Date();

                if (self.cancelled) {
                    resolve();
                }
                else if (now - start > self.timeout) {
                    resolve();
                }
                else {
                    self.tick();
                    setImmediate(loop);
                }
            }

            loop();
        });
    }

    stop() {
        console.log('Stopping animation', this.name);

        return new Promise((resolve, reject) => {
            var pixels = new Pixels(this.strip.width, this.strip.height);

            if (this.cancelled)
                this.strip.render(pixels.getPixels());
            else
                this.strip.render(pixels.getPixels(), {fadeIn:10});

            resolve();
        });
    }



    cancel() {
        var self = this;
        console.log('Cancelling animation', self.name);
        self.cancelled = true;
    }

    run() {
        var self = this;

        return new Promise(function(resolve, reject) {


            self.start().then(function() {

                return self.loop();
            })
            .then(function() {
                return self.stop();
            })
            .then(function() {
                resolve();
            })
            .catch(function(error) {
                reject(error);
            });

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

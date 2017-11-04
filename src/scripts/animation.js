
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');
var Timer   = require('yow/timer');
var Events  = require('events')
var Pixels  = require('./pixels.js');
var Events  = require('events');

module.exports = class Animation extends Events {


    constructor(strip, options) {
        super();

        this.options = Object.assign({}, {priority:'normal'}, options);
        this.strip = strip;
        this.name = 'None';
        this.cancelled = false;
        this.renderFrequency = 0;
        this.renderTime = 0;
        this.pixels = new Pixels(strip.width, strip.height);


    }


    render() {
    }

    start() {
        console.log('Starting animation', this.name);

        return new Promise((resolve, reject) => {

            this.cancelled  = false;
            this.renderTime = 0;

            resolve();

            this.emit('started');

        });

    }

    stop() {
        console.log('Stopping animation', this.name);

        return new Promise((resolve, reject) => {

            if (!this.cancelled) {
                this.pixels.clear();
                this.strip.render(this.pixels.getPixels(), {fadeIn:10});

            }

            resolve();

            this.emit('stopped');
        });
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
                else if (self.options.duration == undefined) {

                    // If no duration specified, render only once and stop
                    self.render();

                    resolve();
                }
                else if (self.options.duration >= 0 && now - start > self.options.duration) {
                    resolve();
                }
                else {
                    var now = new Date();

                    if (self.renderFrequency == 0 || now - self.renderTime >= self.renderFrequency) {
                        self.render();
                        self.renderTime = now;
                    }

                    setImmediate(loop);
                }
            }

            loop();
        });
    }



    cancel() {
        console.log('Cancelling animation', this.name);
        this.cancelled = true;
    }

    run() {

        return new Promise((resolve, reject) => {


            this.start().then(() => {
                return this.loop();
            })
            .then(() => {
                return this.stop();
            })
            .catch((error) => {
                console.log(error);
            })
            .then(() => {
                resolve();
            });

        });

    }
}

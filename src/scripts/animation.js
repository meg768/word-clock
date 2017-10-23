
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');
var Timer   = require('yow/timer');
var Events  = require('events')
var Pixels  = require('./pixels.js');
var Events  = require('events');

module.exports = class Animation extends Events {


    constructor(strip, options) {
        this.options   = Object.assign({}, {timeout:10000}, options);
        this.strip     = strip;
        this.name      = 'None';
        this.cancelled = false;

    }

    setTiemout(ms) {
        this.options.timeout = ms;
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
                else if (self.options.timeout >= 0 && now - start > self.options.timeout) {
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
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });

        });

    }
}

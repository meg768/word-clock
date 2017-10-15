
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
        this.timeout   = 10000;
    }


    tick() {

    }

    start() {
        this.cancelled = false;

        console.log('Starting animation...');
        return Promise.resolve();
    }

    loop() {
        console.log('Running loop');

        return new Promise((resolve, reject) => {

            var start = new Date();

            function loop() {

                console.log('.')
                var now = new Date();

                if (this.cancelled) {
                    resolve();
                }
                else if (now - start > this.timeout) {
                    resolve();
                }
                else {
                    this.tick();
                    setImmediate(loop);
                }
            }

            loop();
        });
    }

    stop() {
        console.log('Stopping animation');
        return Promise.resolve();
    }


    cancel() {
        console.log('Cancelling animation');
        var self = this;
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

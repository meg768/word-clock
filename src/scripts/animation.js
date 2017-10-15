
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

        return Promise.resolve();
    }

    loop() {
        return new Promise(function(resolve, reject) {

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
        });
    }

    stop() {
        return Promise.resolve();
    }


    cancel() {
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

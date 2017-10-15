
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
        this.events    = new Events();
    }

    pause(ms) {
        var self = this;

        return new Promise(function(resolve, reject) {
            var timer = new Timer();
            var resolved = false;

            function timeout() {
                if (!resolved) {
                    resolved = true;

                    timer.cancel();
                    self.events.removeAllListeners('cancel');

                    resolve();
                }
            }

            self.events.on('cancel', timeout);
            timer.setTimeout(ms, timeout);
        });
    }

    reset() {
        self.cancelled = false;

    }

    cancel() {
        var self = this;

        self.cancelled = true;
        self.events.emit('cancel');
    }

    loop() {

    }

    run() {
        return new Promise(function(resolve, reject) {
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


var isArray   = require('yow/is').isArray;
var sprintf   = require('yow/sprintf');
var Color     = require('color');
var random    = require('yow/random');
var Animation = require('./animation.js');
var Pixels    = require('./pixels.js');
var Layout    = require('./layout.js');


module.exports = class extends Animation {


    constructor(strip, options) {
        super(strip, options);

        this.name = 'Word';
    }


    run() {
        var pixels   = new Pixels(this.strip.width, this.strip.height);
        var display  = new Layout();
        var options  = this.options;
        var strip    = this.strip;

        return new Promise((resolve, reject) => {

            resolve();
        });

    }

}

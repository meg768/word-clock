
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');

module.exports = class Animation {


    constructor(display) {
        this.display = display;
    }

    clear() {
        return this.display.clear();
    }


    displayText(words) {
        var self = this;
        var display = this.display;

        return new Promise(function(resolve, reject) {

            display.clear().then(function() {
                return display.draw(words);

            })
            .then(function() {
                return display.show(16);
            })
            .catch(function(error) {
                console.log(error);
            })
            .then(function() {
                resolve();
            })
        });

    }

    run() {
        return Promise.resolve();
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


var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');


module.exports = class Animation {


    constructor(strip) {
        this.strip = strip;
        this.name  = 'None';

    }

    pause(ms) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, ms); 
        });
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

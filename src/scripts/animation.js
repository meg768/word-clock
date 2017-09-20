
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');

export default class Animation {

    constructor() {
    }

    getText() {
        return new Promise(function(resolve, reject) {

            resolve([
                {text: 'HALV', color:'red'},
                {text: 'TRE', color:'blue'}
            ]);
        });

    }

    show(display) {
        var self = this;

        return new Promise(function(resolve, reject) {

            self.getText().then(function(words) {

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
            })
            .catch(function() {
                console.log(error);
            })
            .then(function() {
                resolve();
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

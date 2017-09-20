
var isArray  = require('yow/is').isArray;
var isString = require('yow/is').isString;
var Strip    = require('../scripts/neopixel-strip.js');

var Module = module.exports = function(strip) {

    if (strip == undefined)
        strip = new Strip();

    var _layout = [
        "ZNOKVARTIOJPY",
        "SOLITETJUGOMX",
        "NASDAQVINDFEM",
        "SNÖVERIAUSDAX",
        "DOWJONESÅHALV",
        "FEMOLNIOFYRAQ",
        "ÄHANGSENGBTCU",
        "GBPBRENTIOUSA",
        "SJUKEUREGNOLL",
        "TRETTVÅTTADKK",
        "TOLVZELVAGSEX",
        "PBRICADNIKKEI",
        "SÖTITONMÅLÖFR"
    ];

    var _columns = _layout[0].length;
    var _rows    = _layout.length;
    var _this    = this;

    _this.clear = function() {
        return strip.clear.apply(this, arguments);
    }

    _this.show = function(delay) {
        return strip.show.apply(this, arguments);
    }

    _this.colorize = function(options) {
        return strip.colorize.apply(this, arguments);
    }



    _this.drawWords = function(words) {

        return new Promise(function(resolve, reject) {

            var layout = _this.computeLayout(words);
            var promise = Promise.resolve();

            layout.forEach(function(word) {
                promise = promise.then(function() {
                    var row     = Math.floor(word.index / _columns);
                    var col     = word.index % _columns;
                    var offset  = (row % 2) == 0 ? row * _columns + col : (row + 1) * _columns - col - word.text.length;

                    return _this.colorize({
                        offset     : offset,
                        length     : word.text.length,
                        color      : word.color
                    });
                });
            });

            promise = promise.then(function() {
                resolve();
            })
            .catch(function(error) {
                reject(error);
            })

        });

    }

    _this.drawText = function(text, color) {

        var words = text.split(' ');

        // Ignore multiple spaces between words
        words = words.filter(function(word){
            return word.length > 0;
        });

        words = words.map(function(word) {
            return {text:word, color:color}
        });

        return _this.drawWords(words);
    }


    _this.computeLayout = function(words) {

        if (isString(words)) {
            words = words.split(' ');

            // Ignore multiple spaces between words
            words = words.filter(function(word){
                return word.length > 0;
            });

            words = words.map(function(word) {
                return {text:word, color:'red'}
            });
        }

        try {
            var layout = [];

            function lookupWord(word, cursor) {
                var regexp = new RegExp(word, "g");
                var match, matches = [];

                for (var i = 0; i < _layout.length; i++) {
                    var text = _layout[i];

                    while ((match = regexp.exec(text)) != null) {
                        matches.push(i * _columns + match.index);
                    }

                }

                return matches.find(function(index) {
                    return index >= cursor;
                });
            }


            var cursor = 0;

            words.forEach(function(word) {
                var index = lookupWord(word.text, cursor);

                if (index == undefined)
                    throw new Error('Invalid word:', '*', word.text, '*');

                layout.push({text:word.text, color:word.color, index:index});

                cursor = Math.min(index + word.text.length + 1, Math.floor(index / _columns) * _columns + _columns);
            });

            return layout;

        }
        catch(error) {
            console.log(error);
            return [];
        }
    }


    console.log(JSON.stringify(_this.computeLayout("HALV FEM"), null, 2));

}

//new Module();

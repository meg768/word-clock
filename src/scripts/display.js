
var isArray = require('yow/is').isArray;
var isString = require('yow/is').isString;

var Module = module.exports = function(strip) {

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


    _this.fadeIn = function(delay) {
        return new Promise(function(resolve, reject) {

            strip.clear().then(function() {
                return strip.show(delay);
            })

            .then(function() {
                resolve();
            })

            .catch(function(error) {
                reject(error);
            })
        });

    }

    _this.fadeOut = function(delay) {
        return new Promise(function(resolve, reject) {

            strip.clear().then(function() {
                return strip.show(delay);
            })

            .then(function() {
                resolve();
            })

            .catch(function(error) {
                reject(error);
            })
        });

    }


    _this.draw = function(words) {

        return new Promise(function(resolve, reject) {
            console.log('asdfasdfasdfasdfasdf');
            var layout = _this.computeLayout(words);
            var promise = Promise.resolve();

            layout.forEach(function(word) {
                promise = promise.then(function() {
                    return strip.colorize({
                        offset     : word.offset,
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

        console.log('----------------------', text);
        var words = text.split(' ');

        // Ignore multiple spaces between words
        words = words.filter(function(word){
            return word.length > 0;
        });

        words = words.map(function(word) {
            return {text:word, color:color}
        });

        return _this.draw(words);
    }


    _this.computeLayout = function(words) {

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

            var cursor = 0;

            words.forEach(function(word) {
                var index = lookupWord(word.text, cursor);

                if (index == undefined)
                    throw new Error('Invalid word.');

                var row     = Math.floor(index / _columns);
                var col     = index % _columns;
                var offset  = (row % 2) == 0 ? row * _columns + col : (row + 1) * _columns - col - word.text.length;

                layout.push({text:word.text, color:word.color, row:row, col:col, index:index, offset:offset});

                cursor = Math.min(index + word.text.length + 1, Math.floor(index / _columns) * _columns + _columns);
            });

            return layout;

        }
        catch(error) {
            return [];
        }
    }

    console.log(JSON.stringify(_this.computeLayout("HALV FEM"), null, 2));

}

//new Module();

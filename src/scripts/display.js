
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

    _this.clear = function() {
        return strip.clear();
    }

    _this.show = function(delay) {
        return strip.show(delay);
    }

    _this.fadeIn = function(delay) {
        return strip.show(delay);
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

            var layout = _this.computeLayout(words);
            var promise = Promise.resolve();

            layout.forEach(function(word) {
                promise = promise.then(function() {
                    var row     = Math.floor(word.index / _columns);
                    var col     = word.index % _columns;
                    var offset  = (row % 2) == 0 ? row * _columns + col : (row + 1) * _columns - col - word.text.length;

                    return strip.colorize({
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
/*
    _this.computeLayoutEx = function(words, fromIndex, toIndex) {


        if (fromIndex == undefined)
            fromIndex = 0;

        if (toIndex == undefined)
            toIndex = _rows * _cols - 1;

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
                var regexp = new RegExp(word.text, "g");
                var match, matches = [];

                for (var i = 0; i < _layout.length; i++) {
                    var text = _layout[i];

                    while ((match = regexp.exec(text)) != null) {
                        matches.push(i * _columns + match.index);
                    }

                }

                matches = matches.filter(function(index) {
                    return index >= fromIndex && index + word.text.length - 1 <= toIndex;
                })

                if (matches.length == 0)
                    throw new Error('Invalid word.');

                return matches;
            }

            if (words.length > 0) {
                var word = word[0];
                var matches = findWord(word);
                var layout = [];

                matches.forEach(function(index) {
                    var row     = Math.floor(index / _columns);
                    var col     = index % _columns;
                    var offset  = (row % 2) == 0 ? row * _columns + col : (row + 1) * _columns - col - word.text.length;

                    layout.push({text:word.text, color:word.color, row:row, col:col, index:index, offset:offset});

                    var cursor = Math.min(index + word.text.length + 1, Math.floor(index / _columns) * _columns + _columns);
                    var rest = _this.computeLayout(words.slice(1), cursor);

                    rest.forEach(function(item) {

                    });
                });


            }
            if (words.length == 1) {
                var word = word[0];
                var matches = findWord(word);

                layout.push({text:word.text, color:word.color, index:matches[Math.floor(matches.length / 2)]});
            }
            else {
                var firstWord = words[0];
                var lastWord  = words[words.length - 1];

                var middleWords = words.slice(1, -1);

                var firstMatches = findWord(firstWord);
                var lastMatches  = findWord(lastWord);

                var firstIndex = firstMatches[0];
                var lastIndex = lastMatches[lastMatches.length - 1];

                var fromIndex = Math.min(index + firstWord.text.length + 1, Math.floor(index / _columns) * _columns + _columns);

                layout.push({text:firstWord.text, color:firstWord.color, index:firstIndex});

                if ()
                var middle = _this.computeLayoutEx(middleWords, fromIndex, toIndex);

                layout.push({text:lastWord.text, color:lastWord.color, index:lastIndex});


                var B = _this.computeLayoutEx()
                word = words[words.length - 1];
                matches = findWord(word);
                addWord(word, matches[matches.length - 1]);


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
*/
    console.log(JSON.stringify(_this.computeLayoutEx("HALV FEM", 0, 168), null, 2));

}

//new Module();


var isArray  = require('yow/is').isArray;
var isString = require('yow/is').isString;
var debug = require('./debug.js');

var Module = module.exports = function() {

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


    _this.lookupLetters = function(text) {
        var letters = text.split('');
        var result  = {};

        letters.forEach((letter) => {
            var regexp = new RegExp(letter, "g");
            var match, matches = [];

            for (var i = 0; i < _layout.length; i++) {
                var text = _layout[i];

                while ((match = regexp.exec(text)) != null) {
                    matches.push({text:letter, x:match.index, y : i});
                }

            }

            result[letter] = matches;
        });

        return result;
    }


    _this.lookup = function(words) {

        if (isString(words)) {
            words = words.split(' ');

            // Ignore multiple spaces between words
            words = words.filter(function(word){
                return word.length > 0;
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

                if (word.length == 0)
                    throw new Error('Word may not be empty.');

                var index = lookupWord(word, cursor);

                if (index == undefined)
                    throw new Error('Invalid word:' + '*' + word + '*');

                var row = Math.floor(index / _columns);
                var col = index % _columns;

                layout.push({word:word, x:col, y:row});

                cursor = Math.min(index + word.length + 1, Math.floor(index / _columns) * _columns + _columns);
            });

            return layout;

        }
        catch(error) {
            console.log(error);
            return [];
        }
    }

    _this.lookupText = function(words) {

        if (isString(words)) {
            words = words.split(' ');

            // Ignore multiple spaces between words
            words = words.filter(function(word){
                return word.length > 0;
            });

            words = words.map(function(word) {
                return {text:word}
            });
        }

        debug('Looking up words', words, '...');

        try {
            var layout = [];

            function lookupWord(word, cursor) {
                debug('Looking up word', word, 'cursor at', cursor, '...');

                var regexp = new RegExp(word, "g");
                var match, matches = [];

                for (var i = 0; i < _layout.length; i++) {
                    var text = _layout[i];

                    debug('Searching in', text, 'after', word, '...');

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
                    throw new Error('Invalid word:' + '*' + word.text + '*');

                var row = Math.floor(index / _columns);
                var col = index % _columns;

                layout.push({text:word.text, x:col, y:row});

                cursor = Math.min(index + word.text.length + 1, Math.floor(index / _columns) * _columns + _columns);
            });

            return layout;

        }
        catch(error) {
            console.log(error);
            return [];
        }
    }

    _this.getTextLayout = function(words) {

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

                var row = Math.floor(index / _columns);
                var col = index % _columns;

                layout.push({text:word.text, color:word.color, index:index, row:row, col:col});

                cursor = Math.min(index + word.text.length + 1, Math.floor(index / _columns) * _columns + _columns);
            });

            return layout;

        }
        catch(error) {
            console.log(error);
            return [];
        }
    }

}


var isArray  = require('yow/is').isArray;
var isString = require('yow/is').isString;

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

        forEach((letter) => {
            var regexp = new RegExp(letter, "g");
            var match, matches = [];

            for (var i = 0; i < _layout.length; i++) {
                var text = _layout[i];

                while ((match = regexp.exec(text)) != null) {
                    matches.push({row : i, column:match.index});
                }

            }

            result[letter] = matches;
        });

        return matches;
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

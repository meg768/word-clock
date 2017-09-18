
var isArray = require('yow/is').isArray;
var random = require('yow/random');


module.exports = function() {

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

    _this.getLayout = function(text) {
        return findWords(text);
    }

    function findWords(words) {

        var result = [];
        var matches = findAllWords(words);

        while (matches && matches.length > 0) {
            var match     = random(matches);
            var text      = match.text;
            var col       = match.index % _columns;
            var row       = Math.floor(match.index / _columns);
            var direction = (row % 2) == 0 ? 'right' : 'left';
            var offset    = (row % 2) == 0 ? row * _columns + col : (row + 1) * _columns - col - text.length;

            result.push({text:text, offset:offset, length:text.length, row:row, col:col, direction:direction});

            matches = match.next;
        }

        return result;
    }


    function findWord(word) {
        var regexp = new RegExp(word, "g");
        var match, matches = [];

        for (var i = 0; i < _layout.length; i++) {
            var text = _layout[i];

            while ((match = regexp.exec(text)) != null) {
                matches.push({text:word, index:i * _columns + match.index});
            }

        }

        return matches;
    }


    function findAllWords(words, index) {

        var result = [];

        if (index == undefined)
            index = 0;

        if (!isArray(words)) {
            words = words.split(' ');

            // Ignore multiple spaces between words
            words = words.filter(function(word){
                return word.length > 0;
            });

        }

        if (words.length > 0) {
            var matches = findWord(words[0]);

            matches = matches.filter(function(match) {
                return match.index >= index;
            });

            matches.forEach(function(match) {
                if (words.length == 1)
                    result.push(match);
                else {
                    match.next = findAllWords(words.slice(1), Math.min(match.index + match.text.length + 1, Math.floor(match.index / _columns) * _columns + _columns));

                    if (match.next.length > 0)
                        result.push(match);
                }
            });


        }

        return result;
    }




    function init() {
    }

    init();
}

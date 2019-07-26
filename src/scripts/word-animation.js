
var sprintf = require('yow/sprintf');
var Animation = require('rpi-animations').Animation;
var Layout = require('./layout.js');
var debug = require('./debug.js');

module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;

        super(options);
        
        this.pixels = pixels;
    }

    getWords() {
        return [
            {text:'FEM', color:'red'},
            {text:'I', color:'red'},
            {text:'SEX', color:'blue'}
        ];
    }

    renderWords(words) {
        words.forEach((word) => {
            var color = Color(word.color).rgbNumber();

            for (var i = 0; i < word.text.length; i++) {
                this.pixels.setPixel(word.x + i, word.y, color);
            }
        });
    }

    render() {
        var layout = new Layout();

        var words = this.getWords();
        var text = [];

        words.forEach((word) => {
            text.push(word.text);
        });

        text = layout.lookupText(text);

        this.pixels.clear();

        text.forEach((item, index) => {
            var color = Color(words[index].color).rgbNumber();

            for (var i = 0; i < item.text.length; i++) {
                this.pixels.setPixel(item.x + i, item.y, color);
            }
        });

        this.pixels.render({transition:'fade', duration:200});
    }

}
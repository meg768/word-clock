
var Animation = require('rpi-animations').Animation;
var Layout = require('./layout.js');
var Color = require('color');

var debug = require('./debug.js');


module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;

        super({renderFrequency: 10 * 1000, name:'Word Animation', ...options});
        
        this.pixels = pixels;
    }

    getWords() {
        return [
            {word:'FEM', color:'red'},
            {word:'I', color:'red'},
            {word:'SEX', color:'blue'}
        ];
    }

    render() {
        debug('Rendering words...');

        var layout = new Layout();
        var words = this.getWords();

        var text = [];

        words.forEach((item) => {
            text.push(item.word);
        });

        text = layout.lookup(text);


        this.pixels.clear();

        text.forEach((item, index) => {
            var color = Color(words[index].color).rgbNumber();

            for (var i = 0; i < item.word.length; i++) {
                this.pixels.setPixel(item.x + i, item.y, color);
            }
        });

        this.pixels.render({transition:'fade', duration:200});
    }

}


var Animation = require('rpi-animations').Animation;
var Layout = require('./layout.js');
var Color = require('color');

var debug = require('./debug.js');

module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;

        super({...options, name:'Word Animation', renderFrequency: 2 * 1000});
        
        this.pixels = pixels;
    }

    getWords() {
        return [
            {text:'FEM', color:'red'},
            {text:'I', color:'red'},
            {text:'SEX', color:'blue'}
        ];
    }

    render() {
        debug('Rendering words...');

        var layout = new Layout();
        var words = this.getWords();


        var text = [];

        words.forEach((word) => {
            text.push(word.text);
        });


        text = layout.lookup(text);


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

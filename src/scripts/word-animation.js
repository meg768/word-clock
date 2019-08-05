
var Animation = require('rpi-animations').Animation;
var Layout = require('./layout.js');
var Color = require('color');
var sprintf = require('yow/sprintf');
var debug = require('./debug.js');

var max = 0;

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
        var layout = new Layout();
        var words = this.getWords();

        var items = [];
        var text = [];
        var mA = 0;
        
        words.forEach((item) => {
            items.push(item.word);
            text.push(item.word);    
        });

        items = layout.lookup(items);

        this.pixels.clear();

        items.forEach((item, index) => {
            var color = Color(words[index].color).rgbNumber();
            var power = 0;

            Color(color).rgb().array().forEach((value) => {
                power += (20 * value) / 255;
            });

            for (var i = 0; i < item.word.length; i++) {
                this.pixels.setPixel(item.x + i, item.y, color);
            }

            mA += item.word.length * power;
        });

        if (mA > max)
            max = mA;

        debug(sprintf('"%s" (%d/%d mA)', text.join(' '), mA, max));

        this.pixels.render();
    }

}

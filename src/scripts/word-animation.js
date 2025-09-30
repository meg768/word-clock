
var Animation = require('./animations');
var Layout = require('./layout.js');
var Color = require('color');
var sprintf = require('yow/sprintf');

var maxMilliAmpere = 0;

module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;
        var debug = require('./debug.js');
      
        super({renderFrequency: 10 * 1000, debug:debug, name:'Word Animation', ...options});
        
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
        var milliAmpere = 0;
        
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

            milliAmpere += item.word.length * power;
        });

        maxMilliAmpere = Math.max(maxMilliAmpere, milliAmpere);

        this.debug(sprintf('"%s" (%d mA/%d mA)', text.join(' '), milliAmpere, maxMilliAmpere));

        this.pixels.render();
    }

}

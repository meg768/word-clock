
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
        var layout = new Layout();
        var words = this.getWords();

        var items = [];
        var text = [];
        var power = 0;

        words.forEach((item) => {
            items.push(item.word);
            text.push(item.word);
        });

        items = layout.lookup(items);

        this.pixels.clear();

        items.forEach((item, index) => {
            var color = Color(words[index].color).rgbNumber();
            var rgb =  Color(color).rgb().array();

            power += 20*(rgb[0]/255) + 20*(rgb[1]/255) + 20*(rgb[2]/255);

            for (var i = 0; i < item.word.length; i++) {
                this.pixels.setPixel(item.x + i, item.y, color);
            }
        });

        console.log('Rendering ', text.join(' '), '(', Math.floor(power), 'mA)');

        this.pixels.render();
    }

}

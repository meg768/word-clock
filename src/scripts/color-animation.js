var sprintf    = require('yow/sprintf');
var random     = require('yow/random');
var Colors     = require('color-convert');
var isArray    = require('yow/is').isArray;
var isString   = require('yow/is').isString;
var Animation  = require('./animation.js');


function debug() {
    console.log.apply(this, arguments);
}
module.exports = class extends Animation {


	constructor(strip, options) {
		super(strip, Object.assign({renderFrequency:60000, color:'blue'}, options));

		this.name  = 'Color animation';
		this.color = 'blue';

		try {
			this.color = Color(this.options.color).rgbNumber();
		}
		catch(error) {
			this.color = 'red';
		}
	}



	render() {
		debug('Setting color', this.color)
		this.pixels.fill(this.color);
		this.strip.render(this.pixels.getPixels(), {fadeIn:10});

    }




};

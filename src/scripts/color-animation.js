var Animation = require('rpi-animations').Animation;
var Color = require('color');


function debug() {
    console.log.apply(this, arguments);
}


module.exports = class extends Animation {


	constructor(pixels, options) {
		var {color = 'blue', ...other} = options;

		super(other);

		this.pixels = pixels;
		this.name  = 'Color animation';
		this.renderFrequency = 60000;
		this.color = color;

		try {
			this.color = Color(this.color).rgbNumber();
		}
		catch(error) {
			console.log(error);
			this.color = 'red';
		}
	}



	render() {
		debug('Setting color', this.color);
		this.pixels.fill(this.color);
        this.pixels.render({transition:'fade', duration:200});

    }




};

var Animation = require('rpi-animations').Animation;
var Color = require('color');


function debug() {
    console.log.apply(this, arguments);
}


module.exports = class extends Animation {


	constructor(pixels, options) {
		super(Object.assign({color:'blue'}, options));

		this.pixels = pixels;
		this.name  = 'Color animation';
		this.renderFrequency = 60000;
		this.color = 'blue';

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

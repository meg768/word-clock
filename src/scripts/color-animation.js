var Animation = require('./animation.js');
var Color = require('color');
var debug = require('./debug.js');



module.exports = class extends Animation {


	constructor(options) {

		var {pixels, color = 'blue', ...options} = options;

		super({...options, name:'Color Animation', renderFrequency: 60000});

		this.pixels = pixels;
		this.color  = color;

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

var Color = require('color');

module.exports = class Pixels {
	constructor(options) {
		options = options || {};

		if (options.width == undefined || options.height == undefined) {
			throw new Error('Width and height must be specified.');
		}

		this.width = options.width;
		this.height = options.height;
		this.pixels = new Uint32Array(this.width * this.height);
		this.map = null;

		if (options.map instanceof Uint32Array && options.map.length == this.width * this.height) {
			this.map = options.map;
		}

		if (options.map === 'serpentine' || true) {
			let map = new Uint32Array(this.width * this.height);

			for (var i = 0; i < map.length; i++) {
				var row = Math.floor(i / this.width);
				var col = i % this.width;

				if (row % 2 === 0) {
					map[i] = i;
				} else {
					map[i] = (row + 1) * this.width - (col + 1);
				}
			}

			this.map = map;
		}

		if (!this.map) {
			let map = new Uint32Array(this.width * this.height);

			for (var i = 0; i < map.length; i++) {
				map[i] = i;
			}
			this.map = map;
		}
	}

	RGB(red, green, blue) {
		return (red << 16) | (green << 8) | blue;
	}

	HSL(h, s, l) {
		return Color.hsl(h, s, l).rgbNumber();
	}

	color(name) {
		return Color(name).rgbNumber();
	}

	fill(color) {
		if (typeof color == 'string') color = Color(color).rgbNumber();

		for (var i = 0; i < this.pixels.length; i++) {
			this.pixels[i] = color;
		}
	}

	getIndex(x, y) {
		return this.map[y * this.width + x];
	}

	fillRGB(r, g, b) {
		this.fill(this.RGB(r, g, b));
	}

	fillHSL(h, s, l) {
		this.fill(this.HSL(h, s, l));
	}

	clear() {
		this.fill(0);
	}

	setPixel(x, y, color) {
		this.pixels[this.getIndex(x, y)] = color;
	}

	getPixel(x, y) {
		return this.pixels[this.getIndex(x, y)];
	}

	setPixelColor(x, y, color) {
		this.pixels[this.getIndex(x, y)] = color;
	}

	getPixelColor(x, y) {
		return this.pixels[this.getIndex(x, y)];
	}

	setPixelRGB(x, y, red, green, blue) {
		this.pixels[this.getIndex(x, y)] = this.RGB(red, green, blue);
	}

	setPixelHSL(x, y, h, s, l) {
		this.pixels[this.getIndex(x, y)] = this.HSL(h, s, l);
	}

	render(options) {}
};

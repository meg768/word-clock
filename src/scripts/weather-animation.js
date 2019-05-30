var Animation = require('rpi-animations').Animation;

var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');

var Layout     = require('./layout.js');
var Color      = require('color');
var debug      = require('./debug.js');


module.exports = class extends Animation {


    constructor(pixels, options) {
        super(options);

        this.pixels = pixels;
        this.name  = 'Weather Animation';
        this.cache = undefined;
        this.time  = undefined;
    }


    getWeatherState(text) {


        switch(text) {
            case 'Cloudy':
                return {'MOLN': 1.0};

            case 'Mostly Cloudy':
                return {'SOL': 0.25, 'MOLN':0.75};

            case 'Partly Cloudy':
                return {'SOL': 0.75, 'MOLN':0.25};


            case 'Partly Sunny':
                return {'SOL': 0.50, 'MOLN': 0.50};

            case 'Mostly Sunny':
                return {'SOL': 0.75, 'MOLN': 0.25};

            case 'Clear':
            case 'Sunny':
                return {'SOL':1.0};

            case 'Mostly Clear':
                return {'SOL':0.75, 'MOLN':0.25};

            case 'Rain':
                return {'REGN':1.0, 'MOLN':1.0};

            case 'Light Rain':
                return {'REGN':0.5, 'MOLN':0.5};

            case 'Rain Showers':
                return {'REGN':0.5, 'MOLN':0.5};

            case 'Fog':
                return {'SOL': 0.25, 'MOLN': 0.25};

            case 'T-Storms':
                return {'MOLN': 1.0, 'REGN':0.5, 'VIND':1.0};

            case 'Snow':
                return {'MOLN': 1.0, 'SNÖ':1.0};

            case 'Light Snow':
                return {'MOLN': 0.5, 'SNÖ':0.5};

        }


        console.log(sprintf('Weather condition \'%s\' not defined.', text));

        return {'REGN':1.0, 'MOLN':1.0, 'SNÖ':1.0, 'VIND':1.0, 'SOL':1.0};

    }

    getWeather() {
        return new Promise(function(resolve, reject) {
            try {
                var weather = require('weather-js');

                // Options:
                // search:     location name or zipcode
                // degreeType: F or C

                debug('Fetching weather...');

                weather.find({search: 'Lund, Skåne, Sweden', degreeType: 'C'}, function(error, result) {
                    try {
                        if (error)
                            reject(error);
                        else
                            resolve(result);

                    }
                    catch(error) {
                        console.log(error);
                        reject(error);
                    }
                });


            }
            catch(error) {
                reject(error);
            }
        });
    }

    getForecast() {

        var self = this;
        var now  = new Date();

        // May we use cached weather?
        if (self.time != undefined && self.cache != undefined) {
            if (now.getTime() - self.time.getTime() < 30 * 60 * 1000) {
                debug('Using cached weather.');
                return Promise.resolve(self.cache);
            }
        }

        return new Promise(function(resolve, reject) {

            self.getWeather().then(function(weather) {

                if (isArray(weather))
                    weather = weather[0];

                var current  = weather.current;
                var forecastToday = undefined;
                var forecastTomorrow = undefined;

                var today    = new Date(current.date);
                var tomorrow = new Date(today);

                tomorrow.setDate(today.getDate() + 1);

                weather.forecast.forEach(function(day) {
                    var date = new Date(day.date);

                    // Just for debugging
                    self.getWeatherState(day.skytextday);

                    if (date.valueOf() == today.valueOf())
                        forecastToday = day;

                    if (date.valueOf() == tomorrow.valueOf()) {
                        forecastTomorrow = day;
                    }
                });

                self.time  = new Date();
                self.cache = {
                    current:current.skytext,
                    today:forecastToday.skytextday,
                    tomorrow:forecastTomorrow.skytextday
                };

                resolve(self.cache);

            })
            .catch(function(error) {
                reject(error);
            })

        });
    }

    getText() {

        var self = this;

        return new Promise(function(resolve, reject) {

            self.getForecast().then(function(forecast) {
                var state = self.getWeatherState(forecast.tomorrow);
                var words = "SOL VIND SNÖ MOLN REGN".split(' ');
                var text  = words.map(function(word) {

                    var index     = state[word];
                    var hue       = 240;
                    var luminance = index == undefined ? 1 : index * 50;
                    var color     = sprintf('hsl(%d, 100%%, %d%%)', hue, parseInt(luminance));

                    return {
                        text  : word,
                        color : color
                    }
                });
                resolve(text);

            })
            .catch(function(error) {
                reject(error);
            })

        });
    }

    displayText(words) {
        var self = this;

        var pixels = this.pixels;
        var layout = new Layout();

        words = layout.getTextLayout(words);

        pixels.fill(0);

        words.forEach(function(word) {
            for (var i = 0; i < word.text.length; i++) {
                pixels.setPixel(word.col + i, word.row, Color(word.color).rgbNumber());
            }

        });

        pixels.render({transition:'fade', duration:100});

    }

	start() {

        return new Promise((resolve, reject) => {
            super.start().then(() => {
                return this.getText();
            })

            .then((words) => {
                this.displayText(words);
                resolve();
            })

            .catch((error) => {
                reject(error);
            });
        });
    }


};

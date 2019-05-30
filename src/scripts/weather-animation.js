var Animation = require('rpi-animations').Animation;

var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');

var Layout     = require('./layout.js');
var Color      = require('color');
var debug      = require('./debug.js');
var cached     = require('./cached.js');


var fetchWeather = cached(60000, (location) => {

    return new Promise((resolve, reject) => {
        try {
            var weather = require('weather-js');

            // Options:
            // search:     location name or zipcode
            // degreeType: F or C

            debug('Fetching weather...');

            weather.find({search: location, degreeType: 'C'}, (error, result) => {
                try {
                    if (error)
                        reject(error);
                    else {

                        debug(result);
            
                        resolve(result);
                    }

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
});


module.exports = class extends Animation {


    constructor(options) {
        var {pixels, ...options} = options;

        super({...options, name:'Weather Animation', renderFrequency:60 * 1000});

        this.pixels = pixels;
        this.location = 'Lund, Skåne, Sweden';

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

    getForecast() {


        return new Promise((resolve, reject) => {

            fetchWeather(this.location).then((weather) => {

                if (isArray(weather))
                    weather = weather[0];

                var current  = weather.current;
                var forecastToday = undefined;
                var forecastTomorrow = undefined;

                var today    = new Date(current.date);
                var tomorrow = new Date(today);

                tomorrow.setDate(today.getDate() + 1);

                weather.forecast.forEach((day) => {
                    var date = new Date(day.date);

                    // Just for debugging
                    this.getWeatherState(day.skytextday);

                    if (date.valueOf() == today.valueOf())
                        forecastToday = day;

                    if (date.valueOf() == tomorrow.valueOf()) {
                        forecastTomorrow = day;
                    }
                });

                var forecast = {
                    current:current.skytext,
                    today:forecastToday.skytextday,
                    tomorrow:forecastTomorrow.skytextday
                };

                resolve(forecast);

            })
            .catch((error) => {
                reject(error);
            })

        });
    }

    getText() {

        return new Promise((resolve, reject) => {

            this.getForecast().then((forecast) => {
                var state = this.getWeatherState(forecast.current);
                var words = "SOL VIND SNÖ MOLN REGN".split(' ');
                var text  = words.map((word) => {

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
            .catch((error) => {
                reject(error);
            })

        });
    }

    displayText(words) {

        var pixels = this.pixels;
        var layout = new Layout();

        words = layout.getTextLayout(words);

        pixels.fill(0);

        words.forEach((word) => {
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

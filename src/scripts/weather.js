var schedule = require('node-schedule');
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');
var debug = require('./debug.js');


module.exports = class  {

    constructor(location) {
        this.location = location;
        this.weather = {'REGN':1.0, 'MOLN':1.0, 'SNÖ':1.0, 'VIND':1.0, 'SOL':1.0};

		var fetch = () => {
			this.getWeather().then((weather) => {
                this.weather = weather;
			})
			.catch((error) => {
				console.error(error);
			});
		};

		schedule.scheduleJob({minute:[5, 35]}, fetch);
		fetch();
    }

    fetchWeather(location) {

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
    };
    
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

        return new Promise((resolve, reject) => {

            this.fetchWeather(this.location).then((weather) => {

                if (isArray(weather))
                    weather = weather[0];

                resolve(this.getWeatherState(weather.current.skytext));

            })
            .catch((error) => {
                reject(error);
            })

        });
    }



};

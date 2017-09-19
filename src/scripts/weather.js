
var isArray = require('yow/is').isArray;
var sprintf = require('yow/sprintf');

var Module = module.exports = function() {

    function getWeatherCondition(code) {
        // https://stackoverflow.com/questions/12142094/msn-weather-api-list-of-conditions

        switch(parseInt(code)) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 17:
            case 35:
                return "Thunderstorm";

            case 5:
                return "Rain/Snow";

            case 6:
                return "Sleet/Snow";

            case 7:
                return "Rain/Sleet/Snow";

            case 8:
            case 9:
                return "Icy";

            case 10:
                return "Rain/Sleet";

            case 11:
                return "Light rain";

            case 12:
                return "Rain";

            case 13:
                return "Light snow";

            case 14:
            case 16:
            case 42:
            case 43:
                return "Snow";

            case 15:
                return "Blizzard";

            case 18:
            case 40:
                return "Showers";

            case 19:
                return "Dust";

            case 20:
                return "Fog";

            case 21:
                return "Haze";

            case 22:
                return "Smoke";

            case 23:
            case 24:
                return "Windy";

            case 25:
                return "Frigid";

            case 26:
                return "Cloudy";

            case 27:
            case 28:
            case 29:
            case 30:
            case 33:
            case 34:
                return "Partly Sunny";

            case 31:
            case 32:
                return "Clear";

            case 36:
                return "Hot";

            case 37:
            case 38:
                return "Scattered thunderstorms";

            case 39:
                return "Scattered showers";

            case 41:
                return "Scattered snow showers";

            case 45:
            case 46:
                return "Scattered rain showers";

            case 47:
                return "Scattered thunderstorms";

        }
    }

    function getSkyColors(text) {



        switch(text) {
            case 'Cloudy':
                return {'MOLN': 100};

            case 'Mostly Cloudy':
                return {'SOL': 25, 'MOLN':75};

            case 'Partly Cloudy':
                return {'SOL': 75, 'MOLN':25};


            case 'Partly Sunny':
                return {'SOL': 50, 'MOLN': 50};

            case 'Mostly Sunny':
                return {'SOL': 75, 'MOLN': 25};

            case 'Clear':
            case 'Sunny':
                return {'SOL':100};

            case 'Mostly Clear':
                return {'SOL':75, 'MOLN':25};

            case 'Rain':
                return {'REGN':100, 'MOLN':100};

            case 'Light Rain':
                return {'REGN':50, 'MOLN':50};

            case 'Rain Showers':
                return {'REGN':50, 'MOLN':50};

            case 'Fog':
                return {'SOL': 25, 'MOLN': 25};

            case 'T-Storms':
                return {'MOLN': 100, 'REGN':50, 'VIND':100};

            case 'Snow':
                return {'MOLN': 100, 'SNÖ':100};

            case 'Light Snow':
                return {'MOLN': 50, 'SNÖ':50};

        }


        console.log(sprintf('Weather condition \'%s\' not defined.', text));

        return {'REGN':100, 'MOLN':100, 'SNÖ':100, 'VIND':100, 'SOL':100};

    }

    function getWeather() {
        return new Promise(function(resolve, reject) {
            var weather = require('weather-js');

            // Options:
            // search:     location name or zipcode
            // degreeType: F or C

            weather.find({search: 'Lund, Skåne, Sweden', degreeType: 'C'}, function(error, result) {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });

        });
    }


    function getWeatherColors() {

        return new Promise(function(resolve, reject) {
            getWeather().then(function(weather) {

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
                    getSkyColors(day.skytextday);

                    if (date.valueOf() == today.valueOf())
                        forecastToday = day;

                    if (date.valueOf() == tomorrow.valueOf()) {
                        forecastTomorrow = day;
                    }
                });


//                console.log(getSkyColors(current.skytext));
//                console.log(getSkyColors(forecastToday.skytextday));
//                console.log(getSkyColors(forecastTomorrow.skytextday));

                resolve(getSkyColors(forecastTomorrow.skytextday));

            })
            .catch(function(error) {
                reject(error);;
            })

        });
    }


    function init() {
        getWeatherColors().then(function(weather) {
            console.log(weather);
        })
        .catch(function(error) {
            console.log(error);
        })
    }
    init();
};

new Module();

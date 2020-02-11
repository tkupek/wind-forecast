const DarkSkyApi = require('dark-sky-api');
const APIKeys = require('./config/apiKeys');
const Geocoding = require('./util/geocodingUtil');
const Utility = require('./util/utility');

DarkSkyApi.apiKey = APIKeys.darkSkyAPI;
DarkSkyApi.proxy = true;
DarkSkyApi.units = 'si';

const forecast = {
    getForecast: async function (location, date, time) {
        location = await Geocoding.geocodeLocation(location, 'en');
        let coordinates = { latitude: location.coordinates[1], longitude: location.coordinates[0] };

        let datetime = undefined;
        if(date) {

        }

        if (time) {

        }

        if(datetime) {
            return await DarkSkyApi.loadTime(datetime)
                .then(result => forecast.parseResult(result, location));
        }

        return await DarkSkyApi.loadCurrent(coordinates)
            .then(result => forecast.parseResult(result, location));
    },
    parseResult: function (result, location) {
        console.log(result);
        return {
            location: location.name,
            windSpeed: result.windSpeed,
            windGust: result.windGust,
            cloudCover: result.cloudCover,
            visibility: result.visibility,
            windDirection: result.windDirection,
            units: DarkSkyApi.getResponseUnits()
        };
    }
};

module.exports = forecast;
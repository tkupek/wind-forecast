const DarkSkyApi = require('dark-sky-api');
const APIKeys = require('./config/apiKeys');
const Geocoding = require('./util/geocodingUtil');
const Utility = require('./util/utility');

DarkSkyApi.apiKey = APIKeys.darkSkyAPI;
DarkSkyApi.proxy = true;
DarkSkyApi.units = 'si';

const forecast = {
    getForecast: async function (location, dateTime, withTime) {
        location = await Geocoding.geocodeLocation(location, 'en');
        let coordinates = { latitude: location.coordinates[1], longitude: location.coordinates[0] };

        if(dateTime) {
            let dateTimeString = dateTime.toISOString().slice(0, -5);
            console.debug('Send forecast request with location ' + JSON.stringify(coordinates) + ' and time ' + dateTimeString);
            return await DarkSkyApi.loadTime(dateTimeString, coordinates)
                .then(result => {
                    result = withTime ? forecast.findBestHour(result.hourly.data, dateTime, result.timezone) : result.daily.data[0];
                    return forecast.parseResult(result, location);
                });
        }

        return await DarkSkyApi.loadCurrent(coordinates)
            .then(result => forecast.parseResult(result, location));
    },
    parseResult: function (result, location) {
        return {
            location: location.name,
            windSpeed: result.windSpeed,
            windGust: result.windGust,
            cloudCover: result.cloudCover,
            visibility: result.visibility,
            windDirection: result.windDirection ? result.windDirection : Utility.angleToDirection(result.windBearing),
            units: DarkSkyApi.getResponseUnits(),
            dateTime: undefined
        };
    },
    findBestHour: function (resultList, dateTime, timezone) {
        let bestResult = undefined;
        let distance = -1;

        resultList.forEach(result => {
            let resultTime = new Date(result.time * 1000);
            // convert to timezone
            resultTime = resultTime.toLocaleString("en-US", {timeZone: timezone});
            resultTime = new Date(resultTime);

            let newDistance = Math.abs(resultTime - dateTime);
            if(distance === -1) {
                distance = newDistance;
                bestResult = result;
            } else if(newDistance < distance) {
                bestResult = result;
                distance = newDistance;
            }
        });

        return bestResult;
    }
};

module.exports = forecast;
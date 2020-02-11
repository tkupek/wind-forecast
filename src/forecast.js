const DarkSkyApi = require('dark-sky-api');
const APIKeys = require('./config/apiKeys');

DarkSkyApi.apiKey = APIKeys.darkSkyAPI;
DarkSkyApi.proxy = true;

const forecast = {
    getForecast: async function (location, date, time) {
        location = {
            latitude: 37.8267,
            longitude: -122.4233
        };

        return await DarkSkyApi.loadCurrent(location)
            .then(result => {
                console.log(result);
                return result.windSpeed;
            });
    }
};

module.exports = forecast;
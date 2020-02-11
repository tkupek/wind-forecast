const apiKeys = require('../config/apiKeys');

const googleMapsClient = require('@google/maps').createClient({
  key: apiKeys.googleGeocodingAPI,
  Promise: Promise
});

const geocodingUtil = {
    ERRORS: {
        'GEOCODE_ERROR': 'GEOCODE_ERROR'
    },
    geocodeLocation: async function(location, lang) {
        let resolvedLoc = { name: location };
        let geocodingResult = await geocodingUtil.callGeocodingApi(location, lang);

        resolvedLoc.coordinates = geocodingUtil.getCoordinatesFromResult(geocodingResult, lang);
        return resolvedLoc;
    },
    getCoordinatesFromResult(response, location) {
        if(!response.json.results[0]) {
            console.error('failed to geocode location [' + location + '] response [' + JSON.stringify(response) + ']');
            throw geocodingUtil.ERRORS.GEOCODE_ERROR;
        }
        return [response.json.results[0].geometry.location.lng, response.json.results[0].geometry.location.lat];
    },
    callGeocodingApi: async function(location, lang) {
        let data = {
            address: location,
            language: lang
        };

        try {
            return await googleMapsClient.geocode(data).asPromise();
        } catch(err) {
            console.error('unable to call google geocoding API [' + JSON.stringify(err) + ']');
            throw geocodingUtil.ERRORS.GEOCODE_ERROR;
        }
    }
};

module.exports = geocodingUtil;

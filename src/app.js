'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

const Forecast = require('./forecast');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('WelcomeIntent');
    },

    WelcomeIntent() {
        this.ask('Hi there! What location are you looking for?');
    },

    async GetWindForecast() {
        let result = await Forecast.getForecast(undefined, undefined, undefined);
        this.tell('Here comes the forecast: ' + result + ' knots.');
    },
});

module.exports.app = app;

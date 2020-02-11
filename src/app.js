'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const {App} = require('jovo-framework');
const {Alexa} = require('jovo-platform-alexa');
const {GoogleAssistant} = require('jovo-platform-googleassistant');
const {JovoDebugger} = require('jovo-plugin-debugger');
const {FileDb} = require('jovo-db-filedb');

const Forecast = require('./forecast');
const Utility = require('./util/utility');

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
        this.ask(this.t('welcome'));
    },

    HelpIntent() {
        this.ask(this.t('help'));
    },

    async GetWindForecast() {
        let location = undefined;
        let date = undefined;
        let time = undefined;

        if (this.$inputs.location && this.$inputs.location.value) {
            location = this.$inputs.location.value;
        } else {
            this.ask(this.t('slot-location'));
            return;
        }

        if (this.$inputs.date && this.$inputs.date.value) {
            date = this.$inputs.date.value;
        }
        if (this.$inputs.time && this.$inputs.time.value) {
            time = this.$inputs.time.value;
        }

        let dateTime = Utility.getDateTime(date, time);
        let today = new Date();
        let nextWeek = new Date().setDate(today.getDate() + 7);
        if(dateTime < today) {
            return this.ask(this.t('slot-datetime-past'));
        }
        if(dateTime > nextWeek) {
            return this.ask(this.t('slot-datetime-7d'));
        }
        let result = await Forecast.getForecast(location, dateTime, !!time);

        let speed = Math.round( result.windSpeed * 10) / 10;
        let gust = Math.round( result.windGust * 10) / 10;
        let cloudCover = Math.round(result.cloudCover * 100);
        let visibility = Math.round(result.visibility);

        let speechOutput;
        let mode = 'current';
        if (date || time) {
            mode = 'predicted';
        }

        speechOutput = this.t('forecast-' + mode, {
            location: result.location,
            speed: speed,
            unit: this.t(result.units.windSpeed),
            gust: gust,
            direction: this.t(result.windDirection),
            dateTime: Utility.getDateTimeString(result.dateTime, !!time, this.getLocale())
        });
        speechOutput += ' ' + (cloudCover !== 0 ?
            this.t('clouds-' + mode, {coverage: cloudCover}) : this.t('clouds-no-' + mode));
        speechOutput += ' ' + this.t('visibility-' + mode, {visibility: visibility, unit: result.units.visibility});

        // TODO add warnings that are present in the API

        return this.tell(speechOutput);
    },
});

module.exports.app = app;

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

    'AMAZON.HelpIntent'() {
        return this.toIntent('HelpIntent')
    },

    'AMAZON.NavigateHomeIntent'() {
        return this.toIntent('WelcomeIntent')
    },

    HelpIntent() {
        this.ask(this.t('help'));
    },

    'AMAZON.FallbackIntent'() {
        return this.toIntent('FallbackIntent')
    },

    FallbackIntent() {
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

        let mode = 'current';
        let dateTime = undefined;
        if(date || time) {
            mode = 'predicted';

            dateTime = Utility.getDateTime(date, time, this.getType() === 'AlexaSkill');
            let today = new Date();
            let twoDays = new Date(new Date().setDate(today.getDate() + 2));
            let nextWeek = new Date(new Date().setDate(today.getDate() + 7));

            if (dateTime < today) {
                return this.ask(this.t('slot-datetime-past'));
            }
            if (dateTime > nextWeek) {
                return this.ask(this.t('slot-datetime-7d'));
            }
            if(dateTime > twoDays) {
                time = undefined;
            }
        }

        let result;
        try {
            result = await Forecast.getForecast(location, dateTime, !!time);
        } catch (e) {
            if (e === 'GEOCODE_ERROR') {
                return this.ask(this.t('slot-location-error'))
            }
            throw e;
        }

        let speed = Math.round(result.windSpeed * 10) / 10;
        let gust = Math.round(result.windGust * 10) / 10;
        let cloudCover = Math.round(result.cloudCover * 100);
        let visibility = Math.round(result.visibility);

        let speechOutput;
        let dateTimeString = Utility.getDateTimeString(dateTime, !!time, this.getLocale());
        if (dateTimeString) {
            dateTimeString = this.t('at ') + dateTimeString;
        } else {
            dateTimeString = this.t(dateTimeString = this.t('today'));
        }
        speechOutput = this.t('forecast-' + mode, {
            location: result.location,
            speed: speed,
            unit: this.t(result.units.windSpeed),
            gust: gust,
            direction: this.t(result.windDirection),
            dateTime: dateTimeString
        });
        speechOutput += ' ' + (cloudCover !== 0 ?
            this.t('clouds-' + mode, {coverage: cloudCover}) : this.t('clouds-no-' + mode));
        speechOutput += ' ' + this.t('visibility-' + mode, {visibility: visibility, unit: result.units.visibility});

        // TODO add warnings that are present in the API

        return this.tell(speechOutput);
    },
});

module.exports.app = app;

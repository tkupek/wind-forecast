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

    async GetWindForecast() {
        let location = undefined;
        let date = undefined;
        let time = undefined;

        if (this.$inputs.location && this.$inputs.location.value) {
            location = this.$inputs.location.value;
        } else {
            this.tell(this.t('slot-location'));
            return;
        }

        if (this.$inputs.date && this.$inputs.date.value) {
            date = this.$inputs.date.value;
        }

        if (this.$inputs.time && this.$inputs.time.value) {
            time = this.$inputs.time.value;
        }

        let result = await Forecast.getForecast(location, date, time);

        let speechOutput;
        if (!date && !time) {
            speechOutput = this.t('forecast-current', {
                location: result.location,
                speed: result.windSpeed,
                gust: result.windGust,
                direction: this.t(result.windDirection)
            });

            let cloudCover = Math.round(result.cloudCover * 100);
            speechOutput += ' ' + (cloudCover !== 0 ?
                this.t('clouds-current', {coverage: cloudCover}) : this.t('clouds-current-no'));

            let visibility = Math.round(result.visibility);
            speechOutput += ' ' + this.t('visibility-current', {visibility: visibility})
        }

        // TODO add date / time lookup
        // TODO add warnings

        this.tell(speechOutput);
    },
});

module.exports.app = app;

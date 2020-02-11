const Utility = {
    /**
     * Converts an angle (45') into a direction (North-East)
     * https://stackoverflow.com/questions/48750528/get-direction-from-degrees
     * @param {number} angle - The angle in degree.
     */
    angleToDirection: function (angle) {
        if(!angle) {
            return undefined
        }

        let directions = ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE'];
        return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
    },
    getDateTime: function (date, time) {
        let dateString = undefined;
        if(!date && !time) return dateString;

        if(date) {
            dateString = date
        } else {
            dateString = (new Date()).toISOString().slice(0,10);
        }

        if (time && time !== '0') {
            let timeString = time;
            timeString.length === 1 && (timeString = '0' + timeString);
            !timeString.includes(':') && (timeString += ':00');
            dateString += 'T' + timeString;
        }

        return dateString ? new Date(dateString) : undefined;
    },
    getDateTimeString: function (date, withTime, locale) {
        let dateString = undefined;
        if (!date) return dateString;

        if(!Utility.sameDay(date, new Date())) {
            dateString = '<say-as interpret-as="date" format="md">' + date.toISOString().slice(5, 10) + '</say-as>'
        }
        if(withTime) {
            let time = date.toISOString().slice(11, 16);
            if(locale === 'en' || locale.startsWith('en')) {
                time = date.toLocaleString(locale, { hour: 'numeric', hour12: true })
            }
            dateString.length && (dateString += ' ');
            dateString += '<say-as interpret-as="time">' + time + '</say-as>';
        }

        return dateString;
    },
    sameDay: function(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
};

module.exports = Utility;
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
    /**
     * TODO; refactor date time logic, it's hacky
     */
    getDateTime: function (date, time, timeAsHours) {
        if(date) {
            date = new Date(date);
        } else {
            date = new Date()
        }

        if(time) {
            if(timeAsHours) {
                time.length === 1 && (time = '0' + time);
                time = time + '00:00:00'.substr(0 + time.length, 8);
                time = new Date('1970-01-01T' + time);
            } else {
                time = new Date(time);
            }
            date.setHours(time.getHours());
            date.setMinutes(time.getMinutes());
            date.setSeconds(time.getSeconds());
            return date;
        }

        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);
        return date;
    },
    getDateTimeString: function (date, withTime, locale) {
        let dateString = '';
        if (!date) return dateString;

        if(!Utility.sameDay(date, new Date())) {
            dateString = '<say-as interpret-as="date" format="md">' + date.toLocaleDateString(locale, { month: '2-digit', day: '2-digit' }) + '</say-as>'
        }

        if(withTime) {
            let time = date.toLocaleString(locale, { hour: 'numeric', hour12: locale === 'en' || locale.startsWith('en')});
            dateString += ((dateString.length ? ' ' : '') + '<say-as interpret-as="time">' + time + '</say-as>');
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
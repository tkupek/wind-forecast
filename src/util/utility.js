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
        if(date) {
            dateString = date
        }

        if (time) {
            !dateString && (dateString = (new Date()).toISOString().slice(0,10));
            time = time.toString();
            if(!time.includes(':')) {
                time += ':00'
            }
            dateString += 'T' + time;
        }

        return dateString ? new Date(dateString) : undefined;
    }
};

module.exports = Utility;
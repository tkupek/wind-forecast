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

        let directions = ['North', 'North-West', 'West', 'South-West', 'South', 'South-East', 'East', 'North-East'];
        return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
    }
};

module.exports = Utility
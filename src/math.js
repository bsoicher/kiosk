/**
 * Math functions
 */

module.exports = {

    /**
     * Angle of 3 landmarks
     * @param {NormalizedLandmark} a
     * @param {NormalizedLandmark} b
     * @param {NormalizedLandmark} c
     * @returns {number}
     */
    angle: function (a, b, c) {
        var deg = this.degrees(math.atan2(c.y - b.y, c.x - b.x) - math.atan2(a.y - b.y, a.x - b.x))

        if (deg < 0) {
            deg += 360
            if (deg > 180) {
                deg = 360 - deg
            }
        } else if (deg > 180) {
            deg = 360 - deg
        }

        return deg
    },

    /**
     * Get min/max of landmarks
     * @param {NormalizedLandmarkList} landmarks
     * @returns {Array}
     */
    bounds: function (landmarks) {
        var min = { x: 1, y: 1 }
        var max = { x: -1, y: -1 }

        // Determine boundaries
        landmarks.forEach(function (p) {
            if (p.visibility > style.visibilityMin) {
                if (p.x > max.x) {
                    max.x = p.x
                } else if (p.x < min.x) {
                    min.x = p.x
                }

                if (p.y > max.y) {
                    max.y = p.y
                } else if (p.y < min.y) {
                    min.y = p.y
                }
            }
        })

        return [min, max]
    },

    /**
     * Radians to degrees
     * @param {number} radians
     * @returns {number}
     */
    degrees: function (radians) {
        return radians * (180 / Math.PI)
    },

    /**
     * Distance between two landmarks
     * @param {NormalizedLandmark} a
     * @param {NormalizedLandmark} b
     * @returns {number}
     */
    distance: function (a, b) {
        return Math.sqrt((Math.pow(b.x - a.x, 2)) + (Math.pow(b.y - a.y, 2)))
    }

}
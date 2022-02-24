/**
 * Extends MediaPipe pose
 */
const pose = module.exports = require("@mediapipe/pose")
const draw = pose.draw = require('./draw')
const util = require('./math')

/**
 * Instance of Pose object
 * @var {Pose}
 */
pose.instance = new pose.Pose({
    locateFile: function (file) { 
        return `pose/${file}`
    },
})

// Set model complexity
pose.instance.setOptions({
    selfieMode: true,
    modelComplexity: 2,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    effect: "background",
})

// Expose the results
pose.instance.onResults(function (results) {
    this.results = results

    if (results.poseLandmarks) {
        this.results.heuristics = pose.POSE_HEURISTICS.map(function (a) {
            return util.getAngle.apply(util, a.map(function (index) {
                return results.poseLandmarks[index]
            }))
        })

    }
})

/**
 * Map joint name to index
 * @var {Object}
 */
pose.POSE_JOINTS = {
    LEFT_SHOULDER: 0,   RIGHT_SHOULDER: 7,
    LEFT_ARMPIT: 1,     RIGHT_ARMPIT: 8,
    LEFT_ELBOW: 2,      RIGHT_ELBOW: 9,
    LEFT_HIP: 3,        RIGHT_HIP: 10,
    LEFT_GROIN: 4,      RIGHT_GROIN: 11,
    LEFT_KNEE: 5,       RIGHT_KNEE: 12,
    LEFT_ANKLE: 6,      RIGHT_ANKLE: 13,
}

/**
 * List of landmarks that make up pose heuristics
 * @var {Array}
 */
pose.POSE_HEURISTICS = [
    [12, 11, 13], // LEFT_SHOULDER
    [13, 11, 23], // LEFT_ARMPIT
    [11, 13, 15], // LEFT_ELBOW
    [24, 23, 11], // LEFT_HIP
    [24, 23, 25], // LEFT_GROIN
    [23, 25, 27], // LEFT_KNEE
    [25, 27, 31], // LEFT_ANKLE
    [11, 12, 14], // RIGHT_SHOULDER
    [14, 12, 24], // RIGHT_ARMPIT
    [12, 14, 16], // RIGHT_ELBOW
    [23, 24, 12], // RIGHT_HIP
    [23, 24, 26], // RIGHT_GROIN
    [24, 26, 28], // RIGHT_KNEE
    [26, 28, 32], // RIGHT_ANKLE
]



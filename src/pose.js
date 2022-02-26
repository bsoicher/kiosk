/**
 * Extends MediaPipe pose
 */
const pose = require("@mediapipe/pose")
const math = require('./math')

/**
 * Latest landmark results
 * @var {NormalizedLandmarkList}
 */
pose.results = {
    image: null,
    poseLandmarks: [],
    worldLandmarks: [],
}

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
})

// Expose the results
pose.instance.onResults(function (results) {

    // Ignore empty results
    if (!results.poseLandmarks) {
        return
    }

    // Add calculated heuristics to the results object 
    results.heuristics = pose.POSE_HEURISTICS.map(function (landmarks) {
        return math.angle.apply(math, landmarks.map(function (index) {
            return results.poseLandmarks[index]
        }))
    })

    pose.results = results
    canvas.ctx.drawImage(pose.results.image, 0, 0, canvas.canvas.width, canvas.canvas.height)

    canvas.drawConnectors()
    canvas.drawState()
    //canvas.drawBounds()




})

/**
 * Convert index(s) to landmarks
 * @param {array|number}
 * @returns {array}
 */
pose.asLandmarks = function (list) {
    if (!Array.isArray(list)) {
        list = [list]
    }

    return list.map(function (index) {
        return pose.results.poseLandmarks[index]
    })
}



/**
 * Get a landmark using a variety of inputs
 * @param {number|string} id 
 * @returns {NormalizedLandmark}
 */
pose.getLandmark = function (id) {

    // Use landmark name, fixing case and spaces
    if (typeof id == "string") {
        id = pose.POSE_LANDMARKS[id.toUpperCase().replace(" ", "_")] || null
    }

    // Bad id
    if (typeof id != "number") {
        return null
    }

    return pose.results.poseLandmarks[id]
}

/**
 * Get landmarks using an array of inputs
 * @param {array} ids 
 * @returns {NormalizedLandmarkList}
 */
pose.getLandmarks = function (ids) {
    return ids.map(this.getLandmark)
}






pose.getJoint = function (index) {
    return this.asLandmarks(pose.POSE_HEURISTICS[index])
}


/**
 * Map joint name to index
 * @var {Object}
 */
pose.POSE_JOINTS = {
    LEFT_SHOULDER: 0, RIGHT_SHOULDER: 7,
    LEFT_ARMPIT: 1, RIGHT_ARMPIT: 8,
    LEFT_ELBOW: 2, RIGHT_ELBOW: 9,
    LEFT_HIP: 3, RIGHT_HIP: 10,
    LEFT_GROIN: 4, RIGHT_GROIN: 11,
    LEFT_KNEE: 5, RIGHT_KNEE: 12,
    LEFT_ANKLE: 6, RIGHT_ANKLE: 13,
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


// Expose object
window.pose = pose
module.exports = pose
var pose = require('@mediapipe/pose')

/**
 * COCO keypoints
 */
const keypoints = {
    "nose": 0,
    "leftEye": 2,
    "rightEye": 5,
    "leftEar": 7,
    "rightEar": 8,
    "leftShoulder": 11,
    "rightShoulder": 12,
    "leftElbow": 13,
    "rightElbow": 14,
    "leftWrist": 15,
    "rightWrist": 16,
    "leftHip": 23,
    "rightHip": 24,
    "leftKnee": 25,
    "rightKnee": 26,
    "leftAnkle": 27,
    "rightAnkle": 28
}



console.log(pose)




// @see https://google.github.io/mediapipe/solutions/pose.html
// @see https://github.com/nicrandy/Chakra_yoga
// @see https://towardsdatascience.com/the-machine-learning-web-pose-and-actions-estimator-3203a0cf5f60

/*

module.exports = function(results) {

    if (!results.poseLandmarks) {
        throw new Error('Invalid results object')
    }

    results.posenet = {
        score: 1,
        keypoints: [],
    }

    Object.keys(keypoints).forEach(function(key){
        var index = keypoints[key]

        results.posenet.keypoints.push({
            part: key,
            position: {
                y: results.poseLandmarks[index].y,
                x: results.poseLandmarks[index].x,
            },
            
            score: results.poseLandmarks[index].visibility
        })
    })

    return results
}*/


module.exports = {

    keypoints:[],

    coco: function() {

    }

}


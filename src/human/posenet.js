/**
 * Conversion from blazepose to posenet format
 */

module.exports = {

    keypoints: {
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
    },

    fromBlazePose: function(landmarks) {

        var posenet = {
            score: 1,
            keypoints: [],
        }
    
        Object.keys(this.keypoints).forEach(function (key) {
            var index = keypoints[key]
    
            posenet.keypoints.push({
                part: key,
                position: {
                    y: landmarks[index].y,
                    x: landmarks[index].x,
                },
    
                score: landmarks[index].visibility
            })
        })
    
        return posenet
    }
}
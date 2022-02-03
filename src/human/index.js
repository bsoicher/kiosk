
const pose = require("@mediapipe/pose")
const draw = require("@mediapipe/drawing_utils")

const keypoints = require("./posenet").keypoints

// Setup canvas element & context
const canvas = document.getElementsByTagName("canvas")[0]
if (!canvas) { throw new Error("canvas element not found") }

const context = canvas.getContext("2d")


var human = window.human = module.exports = {

    // Mediapipe results
    results: null,

    update: function (results) {

        if (typeof results === 'object') {
            Object.assign(this, results)
        }

        this.draw()

        // TODO: keep track of results over time?

        return this
    },

    draw: function () {
        if (!this.poseLandmarks) {
            return
        }

        if (this.showOrigin) {
            this.poseLandmarks.push(this.origin())
        }

        context.drawImage(this.image, 0, 0, canvas.width, canvas.height);

        draw.drawConnectors(context, this.poseLandmarks, pose.POSE_CONNECTIONS, {
            visibilityMin: 0.5,
            color: "white",
        })

        draw.drawLandmarks(context, this.poseLandmarks, {
            visibilityMin: 0.5,
            color: "#0f0",
        })

        this.box()

        return this
    },

    /**
     * Show origin landmark
     * @var {Boolean}
     */
    showOrigin: true,

    /**
     * Generate an origin landmark
     * @returns {Object}
     */
    origin: function () {
        if (!this.poseLandmarks) {
            throw new Error('Missing results object')
        }

        var a = this.poseLandmarks[pose.POSE_LANDMARKS.LEFT_HIP]
        var b = this.poseLandmarks[pose.POSE_LANDMARKS.RIGHT_HIP]

        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2,
            z: (a.z + b.z) / 2,
            visibility: (a.visibility + b.visibility) / 2
        }
    },

    /**
     * Draw bounds box
     * @returns {NormalizedRect}
     */
    box: function () {
        var x = { max: -1, min: 1 }
        var y = { max: -1, min: 1 }

        this.poseLandmarks.forEach(function (p) {
            if (p.visibility > .5) {
                if (p.y > y.max) { y.max = p.y }
                else if (p.y < y.min) { y.min = p.y }
                if (p.x > x.max) { x.max = p.x }
                else if (p.x < x.min) { x.min = p.x }
            }
        })

        draw.drawRectangle(context, {
            xCenter: (x.max + x.min) / 2,
            yCenter: (y.max + y.min) / 2,
            height: y.max - y.min,
            width: x.max - x.min,
            rotation: 0,
            rectId: 1
        }, {
            color: 'orange',
            fillColor: 'rgba(0,0,0,0)'
        })
    },

    log: function () {
        if (!this.poseLandmarks) {
            throw new Error('Missing results object')
        }
        var obj = {}

        Object.keys(pose.POSE_LANDMARKS).forEach(function (key) {
            obj[key] = human.poseLandmarks[pose.POSE_LANDMARKS[key]]
        })

        console.log(obj)
    }

}

// @see https://google.github.io/mediapipe/solutions/pose.html
// @see https://github.com/nicrandy/Chakra_yoga
// @see https://towardsdatascience.com/the-machine-learning-web-pose-and-actions-estimator-3203a0cf5f60



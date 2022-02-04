
const pose = require("@mediapipe/pose")
const draw = require("./draw")

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

        context.drawImage(this.image, 0, 0, canvas.width, canvas.height)

        draw.drawConnectors(context, this.poseLandmarks, pose.POSE_CONNECTIONS, { color: "white" })
        draw.drawLandmarks(context, this.poseLandmarks, { color: "#0f0", radius: 5 })
        draw.drawLandmarksData(context, this.poseLandmarks)

        draw.stats(context, this.poseLandmarks)

        //draw.drawBounds(context, this.poseLandmarks)

        return this
    },

    /**
     * Show origin landmark
     * @var {Boolean}
     */
    showOrigin: true,

    /**
     * Calculate origin landmark
     * @returns {NormalizedLandmark}
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

    log: function () {
        if (!this.poseLandmarks) {
            throw new Error('Missing results object')
        }
        var obj = {}

        Object.keys(pose.POSE_LANDMARKS).forEach(function (key) {
            obj[key] = human.poseLandmarks[pose.POSE_LANDMARKS[key]]
        })

        console.log(obj)
    },

    heuristics: function () {
        var c = []

        var data = pose.POSE_CONNECTIONS.map(function (l) {

            if (c[l[0]]) {
                c[l[0]].push(l[1])
            } else {
                c[l[0]] = [l[1]]
            }

            var a = human.poseLandmarks[l[0]]
            var b = human.poseLandmarks[l[1]]

            var dx = b.x - a.x
            var dy = b.y - a.y

            return (Math.atan2(dy, dx) * 180) / Math.PI - 90
        })

        c.forEach(function(v){
            if (v.length === 2) {
                console.log('angle')
            }
        })

    }

}

// @see https://google.github.io/mediapipe/solutions/pose.html
// @see https://github.com/nicrandy/Chakra_yoga
// @see https://towardsdatascience.com/the-machine-learning-web-pose-and-actions-estimator-3203a0cf5f60



/**
 * Canvas setup
 */

const draw = require("@mediapipe/drawing_utils")
const math = require('./math')

// Find element
const el = document.getElementById('canvas')

var canvas = {
    canvas: el,
    ctx: el.getContext("2d"),

    /**
     * Draw a Bounds box around landmarks
     * @param {DrawingOptions} style
     */
    drawBounds: function (results, style) {
        var min = { x: 1, y: 1 }
        var max = { x: -1, y: -1 }

        // Default options
        style = Object.assign({
            color: "orange",
            fillColor: "rgba(255,255,255,0)",
            visibilityMin: .5,
        }, style)

        // Determine boundaries
        results.poseLandmarks.forEach(function (p) {
            if (p.visibility > style.visibilityMin) {
                if (p.x > max.x) { max.x = p.x }
                else if (p.x < min.x) { min.x = p.x }
                if (p.y > max.y) { max.y = p.y }
                else if (p.y < min.y) { min.y = p.y }
            }
        })

        draw.drawRectangle(this.ctx, {
            xCenter: (max.x + min.x) / 2,
            yCenter: (max.y + min.y) / 2,
            height: max.y - min.y,
            width: max.x - min.x,
            rotation: 0,
            rectId: 1
        }, style)
    },

    drawOrigin: function (results) {
        var o = math.origin(results.poseLandmarks)
        draw.drawLandmarks(this.ctx, [o], {
            color: 'rgba(255,0,0,1)',
            fillColor: 'transparent',
            radius: 50
        })
    },

    /**
     * Draw landmarks on the canvas
     * Adds ability to set style individually
     * @param {NormalizedLandmarkList|NormalizedLandmark} landmarks 
     * @param {DrawingOptions} style 
     */
    drawLandmarks: function (results, style) {
      
        // Default style
        style = Object.assign({
            color: "rgba(255,255,255,.75)",
            fillColor: "rgba(255,255,255,.25)"
        }, style)

        results.poseLandmarks.forEach(function (landmark) {
            draw.drawLandmarks(canvas.ctx, [landmark], landmark.style || style)
        })
    },

    drawConnectors: function (results, connections, style) {

        // Default style
        style = Object.assign({
            color: "rgba(255,255,255,.5)",
        }, style)

        draw.drawConnectors(this.ctx, results.poseLandmarks, connections, style)
    },

    drawState: function (results) {

        state = {
            "name": "T",
            "joints": [
                [5, 90],
                [12, 90],
                [2, 180],
                [9, 180],
                [0, 90],
                [7, 90]
            ]
        }

        let used = []
        state.joints.forEach(function(joint) {
            used.push.apply(used, pose.POSE_HEURISTICS[joint[0]])
        })

        results.poseLandmarks = results.poseLandmarks.map(function(landmark, index){
            if (!used.includes(index)) {
                landmark.style = {
                    //color: "rgba(255,255,255,.25)",
                    fillColor: "rgba(255,255,255,.25)",
                }
            }
            return landmark
        })

        state.joints.forEach(function(joint) {
            var angle = results.heuristics[joint[0]]
            var landmark = pose.POSE_HEURISTICS[joint[0]][1]
            var distance = joint[1] - angle
            
            results.poseLandmarks[landmark].style = {
                color: canvas.color(distance),
                radius: 15,

            }
        })

        this.drawLandmarks(results)

    },

    /**
     * Array of text to be printed
     * @param {any} text
     */
    drawText: function(text) {
        if (!Array.isArray(text)) {
            text = [text]
        }

        this.ctx.font = "25px Courier New"
        this.ctx.fillStyle = "white"
        this.ctx.textAlign = "center"
        this.ctx.textBaseline = "middle"

        let p = { x: 50, y: 100 }

        text.forEach(function (t) {
            canvas.ctx.fillText(t, p.x, p.y)
            p.y += 22
        })
    },

    drawImage: function(img) {
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
    },

    drawStats: function() {

    },

    /**
     * Calculate color based on accuracy
     * @param {number} distance
     * @returns {string} css color
     */
    color: function(distance, max) {
        distance = Math.abs(distance)
        max = max || 40

        if (distance > max) {
            return 'red'
        }

        let percent = distance / max
        let hue = ((1-percent)*120).toString(10)

        return `hsl(${hue},100%,50%)`
    },
}



// Expose object
window.canvas = canvas
module.exports = canvas
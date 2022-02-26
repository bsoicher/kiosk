/**
 * Extends MediaPipe drawing utils
 */
const draw = module.exports = require("@mediapipe/drawing_utils")

// Setup canvas element & context
draw.context = document.getElementsByTagName("canvas")[0].getContext("2d")



/**
 * Draw landmarks debug
 * @param {NormalizedLandmarkList} landmarks
 * @param {DrawingOptions} style
 */
draw.drawLandmarksData = function (landmarks, style) {
    var e = this.context.canvas

    // Default options
    style = Object.assign({
        color: "white",
        visibilityMin: .5,
        font: "20px Courier New",
        data: "position"
    }, style)

    ctx.font = style.font
    ctx.fillStyle = style.color
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    landmarks.forEach(function (p) {
        if (p.visibility > style.visibilityMin) {
            ctx.fillText(`${Math.round(p.x * 100)}-${Math.round(p.y * 100)}`, (p.x * e.width) + 10, p.y * e.height)
        }
    })
}


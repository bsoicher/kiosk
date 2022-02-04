/**
 * Extends MediaPipe drawing utils
 */
const draw = module.exports = require("@mediapipe/drawing_utils")

// Setup canvas element & context
const context = document.getElementsByTagName("canvas")[0].getContext("2d")


/**
 * Draw a Bounds box around landmarks
 * @param {CanvasRenderingContext2D} ctx
 * @param {NormalizedLandmarkList} landmarks
 * @param {DrawingOptions} style
 */
draw.drawBounds = function (ctx, landmarks, style) {
    var min = { x: 1, y: 1 }
    var max = { x: -1, y: -1 }

    // Default options
    style = Object.assign({
        color: 'orange',
        fillColor: 'rgba(255,255,255,0)',
        visibilityMin: .5,
    }, style)

    // Determine boundaries
    landmarks.forEach(function (p) {
        if (p.visibility > style.visibilityMin) {
            if (p.x > max.x) { max.x = p.x }
            else if (p.x < min.x) { min.x = p.x }
            if (p.y > max.y) { max.y = p.y }
            else if (p.y < min.y) { min.y = p.y }
        }
    })

    this.drawRectangle(ctx, {
        xCenter: (max.x + min.x) / 2,
        yCenter: (max.y + min.y) / 2,
        height: max.y - min.y,
        width: max.x - min.x,
        rotation: 0,
        rectId: 1
    }, style)
}

/**
 * Draw landmarks debug
 * @param {CanvasRenderingContext2D} ctx
 * @param {NormalizedLandmarkList} landmarks
 * @param {DrawingOptions} style
 */
draw.drawLandmarksData = function (ctx, landmarks, style) {
    var e = ctx.canvas

    // Default options
    style = Object.assign({
        color: 'white',
        visibilityMin: .5,
        font: "20px Courier New",
        data: "position"
    }, style)

    ctx.font = style.font
    ctx.fillStyle = style.color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    landmarks.forEach(function (p) {
        if (p.visibility > style.visibilityMin) {
            ctx.fillText(`${Math.round(p.x * 100)}-${Math.round(p.y * 100)}`, (p.x * e.width) + 10, p.y * e.height)
        }
    })
}

/**
 * Draw landmarks debug
 * @param {CanvasRenderingContext2D} ctx
 * @param {NormalizedLandmarkList} landmarks
 * @param {DrawingOptions} style
 */
draw.stats = function (ctx, landmarks, style) {
    var e = ctx.canvas

    // Default options
    style = Object.assign({
        color: 'green',
        visibilityMin: .5,
        font: "25px Courier New",
    }, style)

    ctx.font = style.font
    ctx.fillStyle = style.color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    var stats = {
        landmarksVisible: 0,
        averageVisibily: [],
    }

    landmarks.forEach(function (p) {
        if (p.visibility > style.visibilityMin) {
            stats.landmarksVisible++


        }
       // averageVisibily.push(p.visibility)
    })



    var point = { x: 10, y: 20 }

    Object.keys(stats).forEach(function (key) {
        ctx.fillText(`${key}:${stats[key]}`, point.x, point.y)
        point.y += 20
    })


}

function arrayAverage(arr) {
    let total = arr.reduce(function (a, b) { return a + b }, 0)
    return total / arr.length
}
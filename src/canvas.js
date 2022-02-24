/**
 * Canvas setup
 */


const draw = require("@mediapipe/drawing_utils")

// Find element
const el = document.getElementById('canvas')

var canvas = {
    canvas: el,
    ctx: el.getContext("2d"),
}

// Expose object
window.canvas = canvas
module.exports = canvas
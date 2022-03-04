/**
 * Webcam setup
 */
const Camera = require("@mediapipe/camera_utils").Camera
const canvas = require("./canvas")
const pose = require("./pose")

// Camera size
const size = { width: 1920, height: 1080 }

// Create element
const el = document.createElement("video")
el.id = "camera"
document.body.appendChild(el)

// Create instance
const camera = new Camera(el, {
    onFrame: async function () {
        await pose.instance.send({
            image: el
        })
    },
    width: size.width,
    height: size.height
})

// Apply dimensions to canvas
canvas.canvas.width = size.width
canvas.canvas.height = size.height

camera.start()

// Expose object
window.camera = camera
module.exports = camera
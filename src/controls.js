/**
 * Setup controls util
 * 
 * Conflicts with normal camera setup
 */
const pose = require("./pose")

const canvas = require("./canvas")
const controls = require("@mediapipe/control_utils")

// Create element
const el = document.createElement("div")
el.id = "controls"
document.body.appendChild(el)

// FPS setup
const fps = new controls.FPS();

// Setup control fields
var panel = new controls.ControlPanel(el, {
    selfieMode: true,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    effect: "background",
}).add([
    fps,
    new controls.SourcePicker({
        onSourceChanged: () => {
            pose.instance.reset()
        },
        onFrame: async (input, size) => {
            const aspect = size.height / size.width;
            let width, height;
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
            } else {
                width = window.innerWidth;
                height = width * aspect;
            }
            canvas.canvas.width = width;
            canvas.canvas.height = height;
            await pose.instance.send({ image: input });
        },
    }),
    new controls.Slider({
        title: "Min Detection Confidence",
        field: "minDetectionConfidence",
        range: [0, 1],
        step: 0.01,
    }),
    new controls.Slider({
        title: "Min Tracking Confidence",
        field: "minTrackingConfidence",
        range: [0, 1],
        step: 0.01,
    }),
    new controls.Slider({
        title: "Effect",
        field: "effect",
        discrete: { background: "Background", mask: "Foreground" },
    }),
]).on(function (opts) {
    pose.instance.setOptions(opts)
})

// Proxy for fps tick
panel.tick = function() {
    fps.tick()
}

// Expose object
window.controls = panel
module.exports = panel
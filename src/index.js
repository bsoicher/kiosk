import human from "./human";
import "./style.css";

const controls = require("@mediapipe/control_utils");
const drawingUtils = require("@mediapipe/drawing_utils");



var ps = require('posenet-similarity')

var mpPose = require("@mediapipe/pose")


const $ = require("jquery/dist/jquery.slim.min");



var videoElement = $("#video").get(0)
var canvasElement = $("#canvas").get(0)
var controlsElement = $(".control-panel").get(0)


var vis = $("#vis").css({
  postion: 'absolute',
  left: 0,
  top: 0,
  'font-size': '30px'
})
  .get(0);

// Our input frames will come from here.

const canvasCtx = canvasElement.getContext("2d");

// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
const fpsControl = new controls.FPS();


var first = true;



const pose = new mpPose.Pose({
  locateFile: function (file) {
    return `pose/${file}`;
  },
});

pose.setOptions({
  modelComplexity: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

pose.onResults(function onResults(results) {
  if (first) {
    first = false;
    $("#loading").remove();
    console.log(pose)
  }


  // Update the frame rate.
  fpsControl.tick();
  // Draw the overlays.



  human.update(results)

   
  
   
    /*
    if (tick % 250 == 0) {
      results = posenet(results)
      console.log(results.posenet)

      try {
        var html = ps.poseSimilarity(pose1, results.posenet, { strategy: 'weightedDistance' }) + '<br>'
        html += ps.poseSimilarity(pose1, results.posenet, { strategy: 'cosineDistance' }) + '<br>'
        html += ps.poseSimilarity(pose1, results.posenet, { strategy: 'cosineSimilarity' })
      } catch (e) {
        console.log(e)
      }
      $('#vis').html(html)

      pose1 = results
    }*/


});

// Present a control panel through which the user can manipulate the solution
// options.
new controls.ControlPanel(controlsElement, {
  selfieMode: true,

  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  effect: "background",
})
  .add([
    fpsControl,
    new controls.SourcePicker({
      onSourceChanged: () => {
        // Resets because this model gives better results when reset between
        // source changes.
        pose.reset();
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
        canvasElement.width = width;
        canvasElement.height = height;
        await pose.send({ image: input });
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
  ])
  .on(function (x) {
    pose.setOptions(x);
  });

import "./style.css";

const controls = require("@mediapipe/control_utils");
const drawingUtils = require("@mediapipe/drawing_utils");


var posenet = require('./human')
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

let activeEffect = "mask";

var first = true;
var tick = 0;

function onResults(results) {
  if (first) {
    first = false;
    $("#loading").remove();
  }

  // Add angle calculations
  //results = calculateAngles(results);

  // Update the frame rate.
  fpsControl.tick();
  // Draw the overlays.
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  if (results.segmentationMask) {
    canvasCtx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    // Only overwrite existing pixels.
    if (activeEffect === "mask" || activeEffect === "both") {
      canvasCtx.globalCompositeOperation = "source-in";
      // This can be a color or a texture or whatever...
      canvasCtx.fillStyle = "#00FF007F";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    } else {
      canvasCtx.globalCompositeOperation = "source-out";
      canvasCtx.fillStyle = "#0000FF7F";
      canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    }
    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop";
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasCtx.globalCompositeOperation = "source-over";
  } else {
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
  }

  if (results.poseLandmarks) {
    drawingUtils.drawConnectors(
      canvasCtx,
      results.poseLandmarks,
      mpPose.POSE_CONNECTIONS,
      {
        visibilityMin: 0.5,
        color: "white",
      }
    );

    Object.values(results.poseLandmarks).forEach(function (landmark) {
      drawingUtils.drawLandmarks(canvasCtx, [landmark], {
        visibilityMin: 0.5,
        color: (function (v) {
          var r = (1 - v) * 255;
          var g = v * 255;

          return "rgb(" + r + "," + g + ",0)";
        })(landmark.visibility),
      });
    });

    tick += 1
    results.keypoints = results.poseLandmarks;


  
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
















    //console.log(results.poseJoints);
  }
  canvasCtx.restore();
}

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

pose.onResults(onResults);

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

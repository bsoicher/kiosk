
require("./style.css")

require("./camera")

const pose = require("./pose")

import human from "./human";


pose.instance.onResults(function (results) {

  if (typeof controls === 'object') {
    controls.tick()
  }

  human.update(results)

})


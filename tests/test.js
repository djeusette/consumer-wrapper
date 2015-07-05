// iojs --strong_mode --use_strict tests/test.js

"use strict";
"use strong";

let path            = require("path")
let ConsumerWrapper = require("../src/main")

let consumerWrapper = new ConsumerWrapper(path.resolve(__dirname, "..", "config", "configuration"), 4)

consumerWrapper.start()

setTimeout(function() {
  consumerWrapper.stop()
}, 5000)

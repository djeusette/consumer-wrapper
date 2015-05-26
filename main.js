// iojs --strong_mode --use_strict

"use strict";
"use strong";

const cpuCount = require("os").cpus().length
let cluster    = require("cluster")
let App        = require("./app/app")

let appAttributes = {
  amqpUrl: "amqp://localhost"
}

if (cluster.isMaster) {
  let i;
  // Fork workers.
  for (i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", function(worker, code, signal) {
    console.log("worker " + worker.process.pid + " died");
  });
} else {
  let app = new App(appAttributes)

  app.start().then(function() {
    console.log("worker " + process.pid + " started")
  })
}

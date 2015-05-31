// iojs --strong_mode --use_strict

"use strict";
"use strong";

const cpuCount        = require("os").cpus().length
let cluster           = require("cluster")
let path              = require("path")
let App               = require("./app/app")
let Assembler         = require("./infrastructure/assembler")
let configurationPath = path.join(__dirname, "config", "configuration");

function startApp() {
  let assembler = new Assembler(App, configurationPath)
  assembler.loadCompleteApp()
  assembler.app.start().then(function() {
    console.log("worker " + process.pid + " started")
  }).catch(function(err) {
    console.warn("worker " + process.pid + " error: " + err.toString());
  })
}

if (cluster.isMaster) {
  let i;
  for (i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", function(worker, code, signal) {
    console.log("worker " + worker.process.pid + " died");
  });
} else {
  startApp()
}

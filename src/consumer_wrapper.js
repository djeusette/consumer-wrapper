"use strict";
"use strong";

let cluster = require("cluster")
let path    = require("path")
let _       = require("lodash")

class ConsumerWrapper {
  constructor(configurationPath, concurrency) {
    if (!_.isString(configurationPath)) {
      throw new Error("Missing configuration path")
    }
    if (!_.isNumber(concurrency) || concurrency < 1) {
      throw new Error("Invalid concurrency")
    }

    this.configurationPath = configurationPath
    this.concurrency       = concurrency

    let clusterSettings = {
      exec: path.resolve(__dirname, "loader"),
      args: [configurationPath]
    }

    cluster.setupMaster(clusterSettings)
  }

  start() {
    if (cluster.isMaster) {
      cluster.on("exit", function(worker, code, signal) {
        console.log("worker " + worker.process.pid + " died");
      });

      let i;
      for (i = 0; i < this.concurrency; i++) {
        cluster.fork();
      }
    }
  }

  stop() {
    cluster.disconnect(function() {
      console.log("All workers are now disconnected")
    })
  }
}

module.exports = ConsumerWrapper

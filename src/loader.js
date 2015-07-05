"use strict";
"use strong";

let App               = require("./app/app")
let Assembler         = require("./infrastructure/assembler")
let configurationPath = process.argv[2]

let assembler = new Assembler(App, configurationPath)
assembler.loadCompleteApp()
assembler.app.start().then(function() {
  assembler.app.logger.info("worker " + process.pid + " started")
}).catch(function(err) {
  assembler.app.logger.error("worker " + process.pid + " error: " + err.toString());
  process.exit(1);
})

process.on("disconnect", function() {
  assembler.app.stop().then(function() {
    assembler.app.logger.info("worker " + process.pid + " disconnected")
  }).catch(function(err) {
    assembler.app.logger.error("worker " + process.pid + " error while disconnecting: " + err.toString());
    process.exit(1)
  })
})

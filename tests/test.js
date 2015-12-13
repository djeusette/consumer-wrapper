"use strict";
"use strong";

let path      = require("path");
let Assembler = require("./infrastructure/assembler");

var assembleApp = function(appCtor, configurationPath) {
  let assembler = new Assembler(appCtor, configurationPath);
  assembler.loadCompleteApp();
  return assembler.app.start().tap(function() {
    assembler.app.logger.info("worker " + process.pid + " started");
  }).then(function() {
    return assembler.app;
  }).catch(function(err) {
    assembler.app.logger.error("worker " + process.pid + " error: " + err.toString());
    process.exit(1);
  });
};

let ConsumerApp = require("./consumer_app");
let consumerConfigurationPath = path.resolve(__dirname, "config", "consumer_configuration");
let ProducerApp = require("./producer_app");
let producerConfigurationPath = path.resolve(__dirname, "config", "producer_configuration");

return assembleApp(ConsumerApp, consumerConfigurationPath).tap(function(consumerApp) {
  return consumerApp.initializeConsumers();
}).tap(function(consumerApp) {
  return consumerApp.start();
}).then(function() {
  return assembleApp(ProducerApp, producerConfigurationPath);
}).tap(function(producerApp) {
  return producerApp.initializeProducer();
}).tap(function(producerApp) {
  return producerApp.start();
}).then(function(producerApp) {
  return producerApp.publish("Message produced");
});

// Stop

// setTimeout(function() {
//   return assembler.app.stop().then(function() {
//     return consumerWrapper.stop();
//   });
// }, 5000)

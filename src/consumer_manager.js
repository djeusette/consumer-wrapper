"use strict";
"use strong";

let Promise   = require("bluebird");
let consumers = [];

let ConsumerManager = {
  add: function(consumer) {
    consumers.push(consumer);
  },
  start: function() {
    return Promise.each(consumers, function(consumer) {
      if (consumer.initialize) {
        return consumer.initialize().then(function() {
          return consumer.start();
        });
      } else {
        return consumer.start();
      }
    });
  },
  stop: function() {
    Promise.each(consumers, function(consumer) {
      return consumer.stop();
    });
  }
};

module.exports = ConsumerManager;

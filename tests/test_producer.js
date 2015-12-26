"use strict";
"use strong";

let async = require('async');

let Producer = require('../main').AmqpProducer;
let attributes = {
  amqp: {
    url: 'amqp://localhost',
    queue: 'test',
    exchange: 'test',
    routingKey: '#'
  }
};

Producer.connect(attributes).then(function() {
  let queue = async.queue(function(count, callback) {
    if (count > 0) {
      Producer.publish("Test " + count).then(function() {
        queue.push(--count);
        async.setImmediate(callback);
      });
    } else {
      Producer.disconnect().then(callback);
    }
  }, 5);

  queue.push(100000);
});

"use strict";
"use strong";

let Promise = require('bluebird');

let handler = function(item) {
  console.log('Item received', item.content.toString());
};

let promiseHandler = function(item) {
  return new Promise(function(resolve, reject) {
    console.log('Item received', item.content.toString());
    resolve(item);
  });
};

let Consumer = require('../main').AmqpConsumer;
let attributes = {
  handler: handler,
  amqp: {
    url: 'amqp://localhost',
    queue: {
      name: 'test',
      options: {}
    },
    exchange: {
      name: 'test',
      type: 'topic',
      options: {}
    },
    routingKey: '#'
  }
};

let consumer = Consumer.consume(attributes);

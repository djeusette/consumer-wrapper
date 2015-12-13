"use strict";
"use strong";

let AmqpConsumer = require("../../main").AmqpConsumer;

let configuration = {
  production: {
    app: {
      consumers: [
        {
          ctor: AmqpConsumer,
          attributes: {
            amqp: {
              url: "amqp://localhost",
              queue: "message-persister",
              exchange: "messages",
              routingKey: "#"
            }
          }
        }
      ]
    }
  },
  development: {
    app: {
      consumers: [
        {
          ctor: AmqpConsumer,
          attributes: {
            amqp: {
              url: "amqp://localhost",
              queue: "message-persister",
              exchange: "messages",
              routingKey: "#"
            }
          }
        }
      ]
    }
  }
}

module.exports = configuration;

"use strict";
"use strong";

let AmqpProducer = require("../../main").AmqpProducer;

let configuration = {
  production: {
    app: {
      ctor: AmqpProducer,
      attributes: {
        amqp: {
          url: "amqp://localhost",
          exchange: "messages",
          routingKey: "#"
        }
      }
    }
  },
  development: {
    app: {
      ctor: AmqpProducer,
      attributes: {
        amqp: {
          url: "amqp://localhost",
          exchange: "messages",
          routingKey: "#"
        }
      }
    }
  }
}

module.exports = configuration;

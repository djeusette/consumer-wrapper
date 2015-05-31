"use strict";
"use strong";

let configuration = {
  production: {
    app: {
      amqpUrl: "amqp://localhost"
    }
  },
  development: {
    app: {
      amqpUrl: "amqp://localhost"
    }
  }
}

module.exports = configuration

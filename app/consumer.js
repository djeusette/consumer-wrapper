"use strict";
"use strong";

let amqp    = require("amqplib")
let Promise = require("bluebird")

class Consumer {
  constructor(attributes) {
    if (typeof attributes === "undefined" || attributes === null)
      throw new Error("Missing attributes")
    if (attributes.app === null)
      throw new Error("Missing app")
    if (attributes.url === null)
      throw new Error("Missing url")
    if (attributes.queue === null)
      throw new Error("Missing queue")

    this.app   = attributes.app
    this.url   = attributes.url
    this.queue = attributes.queue
  }

  start() {
    return new Promise(function(resolve, reject) {
      // TODO: connect to amqp and consume messages
      resolve()
    });
  }
}

module.exports = Consumer

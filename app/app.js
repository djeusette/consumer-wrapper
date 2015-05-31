"use strict";
"use strong";

let Consumer = require("./consumer")

class App {
  constructor(attributes) {
    if (typeof attributes === "undefined" || attributes === null)
      throw new Error("Missing attributes")
    if (attributes.env === null)
      throw new Error("Missing env")
    if (attributes.logger === null)
      throw new Error("Missing logger")
    if (attributes.amqpUrl === null)
      throw new Error("Missing AMQP url")

    this.env     = attributes.env
    this.logger  = attributes.logger
    this.amqpUrl = attributes.amqpUrl
  }

  start() {
    let attributes = {
      app   : this,
      url   : this.amqpUrl,
      queue : "test"
    }

    this.consumer = new Consumer(attributes)
    return this.consumer.start()
  }
}

module.exports = App

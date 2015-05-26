"use strict";
"use strong";

let Consumer = require("./consumer")

class App {
  constructor(attributes) {
    if (typeof attributes === "undefined" || attributes === null)
      throw new Error("Missing attributes")
    if (attributes.amqpUrl === null)
      throw new Error("Missing AMQP url")

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

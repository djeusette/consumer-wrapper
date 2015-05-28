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
    function logMessage(msg) {
      console.log(" [x] %s:'%s'",
                  msg.fields.routingKey,
                  msg.content.toString())
    }

    return amqp.connect(this.url).then(function(conn) {
      process.once("SIGINT", function() { conn.close(); });

      return conn.createChannel().then(function(channel) {
        return Promise.all([
            channel.assertQueue("message-persister", {exclusive: false}),
            channel.assertExchange("messages", "topic", {durable: true}),
            channel.bindQueue("message-persister", "messages", "#"),
            channel.consume("message-persister", logMessage, {noAck: true})
          ])
      })
    })
  }
}

module.exports = Consumer

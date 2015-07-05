"use strict";
"use strong";

let amqp     = require("amqplib")
let Promise  = require("bluebird")
let _        = require("lodash")
let Consumer = require("./consumer")

class AmqpConsumer extends Consumer {
  constructor(attributes) {
    super(attributes)

    if (!_.isPlainObject(attributes.amqp)) {
      throw new Error("Missing AMQP attributes")
    }

    this.amqp       = attributes.amqp
    this.connection = null
    this.channel    = null
  }

  consumeMessage(msg) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  start() {
    let self = this

    return new Promise(function(resolve, reject) {
      if (!_.isString(self.amqp.url)) {
        return reject(new Error("Missing AMQP url"))
      }
      if (!_.isString(self.amqp.queue)) {
        return reject(new Error("Missing AMQP queue"))
      }
      if (!_.isString(self.amqp.exchange)) {
        return reject(new Error("Missing AMQP exchange"))
      }
      if (!_.isString(self.amqp.routingKey)) {
        return reject(new Error("Missing AMQP routingKey"))
      }

      return amqp.connect(self.amqp.url).then(function(conn) {
        process.once("SIGINT", function() { conn.close(); });

        self.connection = conn

        return conn.createChannel().then(function(channel) {
          self.channel = channel

          return resolve(Promise.all([
              channel.assertQueue(self.amqp.queue, {exclusive: false}),
              channel.assertExchange(self.amqp.exchange, "topic", {durable: true}),
              channel.bindQueue(self.amqp.queue, self.amqp.exchange, self.amqp.routingKey),
              channel.consume(self.amqp.queue, self.consumeMessage.bind(self), {noAck: true})
            ]))
        })
      }).catch(reject);
    })
  }

  stop() {
    let self = this

    return new Promise(function(resolve, reject) {
      self.channel.close().then(function() {
        self.connection.close()
      }).then(resolve).catch(reject)
    })
  }
}

module.exports = AmqpConsumer

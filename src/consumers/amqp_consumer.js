"use strict";
"use strong";

let amqp     = require("amqplib");
let Promise  = require("bluebird");
let _        = require("lodash");
let Consumer = require("./consumer");

class AmqpConsumer extends Consumer {
  constructor(attributes) {
    super(attributes);

    if (!_.isPlainObject(attributes.amqp)) {
      throw new Error("Missing AMQP attributes");
    }

    this.amqp       = attributes.amqp;
    this.connection = null;
    this.channel    = null;
  }

  consume(content) {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.logMessage(content);
      resolve();
    });
  }

  logMessage(msg) {
    this.logger.log("verbose", " [%s] %s: '%s'",
      process.pid.toString(),
      msg.fields.routingKey,
      msg.content.toString());
  }

  start() {
    let self = this;

    return new Promise(function(resolve, reject) {
      if (!_.isString(self.amqp.url)) {
        return reject(new Error("Missing AMQP url"));
      }
      if (!_.isString(self.amqp.queue)) {
        return reject(new Error("Missing AMQP queue"));
      }
      if (!_.isString(self.amqp.exchange)) {
        return reject(new Error("Missing AMQP exchange"));
      }
      if (!_.isString(self.amqp.routingKey)) {
        return reject(new Error("Missing AMQP routingKey"));
      }

      return amqp.connect(self.amqp.url).then(function(conn) {
        process.once("SIGINT", function() { self.stop(); });

        self.connection = conn;

        return conn.createChannel().then(function(channel) {
          self.channel = channel;

          return resolve(Promise.all([
              channel.assertQueue(self.amqp.queue, {exclusive: false}),
              channel.assertExchange(self.amqp.exchange, "topic", {durable: true}),
              channel.bindQueue(self.amqp.queue, self.amqp.exchange, self.amqp.routingKey),
              channel.consume(self.amqp.queue, self.consume.bind(self), {noAck: true})
            ]));
        });
      }).catch(reject);
    });
  }

  stop() {
    let self = this;

    return self.channel.close().then(function() {
      return self.connection.close();
    });
  }
}

module.exports = AmqpConsumer;

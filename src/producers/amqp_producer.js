"use strict";
"use strong";

let amqp     = require("amqplib");
let Promise  = require("bluebird");
let _        = require("lodash");
let Producer = require("./producer");

class AmqpProducer extends Producer {
  constructor(attributes) {
    super(attributes);

    if (!_.isPlainObject(attributes.amqp)) {
      throw new Error("Missing AMQP attributes");
    }

    this.amqp       = attributes.amqp;
    this.connection = null;
    this.channel    = null;
  }

  publish(msg) {
    this.logger.log("verbose", "[%s] Publish message \"%s\" on exchange \"%s\" with routing key \"%s\"",
        process.pid.toString(),
        msg.toString(),
        this.amqp.exchange,
        this.amqp.routingKey);

    return this.channel.publish(this.amqp.exchange, this.amqp.routingKey, new Buffer(msg));
  }

  initialize() {
    let self = this;

    return new Promise(function(resolve, reject) {
      if (!_.isString(self.amqp.url)) {
        return reject(new Error("Missing AMQP url"));
      }
      if (!_.isString(self.amqp.exchange)) {
        return reject(new Error("Missing AMQP exchange"));
      }
      if (!_.isString(self.amqp.routingKey)) {
        return reject(new Error("Missing AMQP routingKey"));
      }

      return amqp.connect(self.amqp.url).then(function(conn) {
        process.once("SIGINT", function() { self.destroy(); });

        self.connection = conn;

        return conn.createChannel().then(function(channel) {
          self.channel = channel;
          resolve(channel);
        });
      }).catch(reject);
    });
  }

  destroy() {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.channel.close().then(function() {
        self.connection.close();
      }).then(resolve).catch(reject);
    });
  }
}

module.exports = AmqpProducer;

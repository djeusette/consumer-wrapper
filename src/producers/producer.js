"use strict";
"use strong";

let Promise = require("bluebird");
let _       = require("lodash");
let winston = require("winston");

let broker = null;

class Producer {
  static connect(attributes) {
    return new this(attributes).connect().tap(function(producer) {
      broker = producer;
    });
  }

  static disconnect() {
    return broker.destroy().tap(function() {
      broker = null;
    });
  }

  static connected() {
    return broker && broker.connection && broker.channel;
  }

  static publish(content, options) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if (!self.connected()) {
        return reject(new Error("Producer not connected"));
      }
      return broker.publish(content, options).then(resolve);
    });
  }

  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }

    this.logger = _.isObject(attributes.logger) ? attributes.logger : new winston.Logger({
      transports: [new winston.transports.Console({level: process.env.LOG_LEVEL || 'verbose', colorize: true})]
    });
  }

  publish(content, options) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }

  connect() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }

  destroy() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }
}

module.exports = Producer;

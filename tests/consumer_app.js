"use strict";
"use strong";

let _               = require("lodash");
let Promise         = require("bluebird");
let ConsumerManager = require("../main").ConsumerManager;

class App {
  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }
    if (!_.isString(attributes.env)) {
      throw new Error("Missing env");
    }
    if (!_.isObject(attributes.logger)) {
      throw new Error("Missing logger");
    }
    if (!_.isArray(attributes.consumers)) {
      throw new Error("Missing consumers attributes");
    }

    this.env                 = attributes.env;
    this.logger              = attributes.logger;
    this.consumersAttributes = attributes.consumers;
  }

  initializeConsumers() {
    let self = this;

    return Promise.each(this.consumersAttributes, function(consumerAttributes) {
      return self.initializeConsumer(consumerAttributes);
    });
  }

  initializeConsumer(attributes) {
    let self = this;

    return new Promise(function(resolve, reject) {
      if (!_.isObject(attributes.ctor)) {
        return reject(new Error("Missing consumer constructor"));
      }

      if (!_.isPlainObject(attributes.attributes)) {
        return reject(new Error("Missing consumer constructor attributes"));
      }

      _.merge(attributes.attributes, {logger: self.logger});

      resolve(new attributes.ctor(attributes.attributes));
    });
  }

  start() {
    return ConsumerManager.start();
  }

  stop() {
    return ConsumerManager.stop();
  }
}

module.exports = App

"use strict";
"use strong";

let _        = require("lodash");
let Promise  = require("bluebird");

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
    if (!_.isObject(attributes.ctor)) {
      throw new Error("Missing producer ctor");
    }
    if (!_.isPlainObject(attributes.attributes)) {
      throw new Error("Missing producer attributes");
    }

    this.env                = attributes.env;
    this.logger             = attributes.logger;
    this.producerAttributes = attributes.attributes;
    this.producerCtor       = attributes.ctor;
    this.producer           = null;
  }

  initializeProducer() {
    let self = this;

    return new Promise(function(resolve, reject) {
      if (!_.isObject(self.producerCtor)) {
        return reject(new Error("Missing producer constructor"));
      }

      if (!_.isPlainObject(self.producerAttributes)) {
        return reject(new Error("Missing producer constructor attributes"));
      }

      _.merge(self.producerAttributes, {logger: self.logger});

      self.producer = new self.producerCtor(self.producerAttributes);
      resolve(self.producer);
    });
  }

  start() {
    let self = this

    return this.initializeProducer().then(function() {
      return self.producer.initialize();
    });
  }

  stop() {
    return this.producer.destroy();
  }

  publish(message) {
    return this.producer.publish(message);
  }
}

module.exports = App

"use strict";
"use strong";

let Promise = require("bluebird");
let _       = require("lodash");

class Producer {
  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }
    if (!_.isObject(attributes.logger)) {
      throw new Error("Missing logger");
    }

    this.logger = attributes.logger;
  }

  publish(content) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }

  initialize() {
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

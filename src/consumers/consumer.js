"use strict";
"use strong";

let Promise = require("bluebird");
let _       = require("lodash");
let ConsumerManager = require("../consumer_manager");

class Consumer {
  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }
    if (!_.isObject(attributes.logger)) {
      throw new Error("Missing logger");
    }

    this.logger = attributes.logger;
    ConsumerManager.add(this);
  }

  consume(content) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }

  start() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }

  stop() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }
}

module.exports = Consumer;
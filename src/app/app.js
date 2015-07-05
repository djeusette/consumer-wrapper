"use strict";
"use strong";

let _        = require("lodash")
let Promise  = require("bluebird")

class App {
  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes")
    }
    if (!_.isString(attributes.env)) {
      throw new Error("Missing env")
    }
    if (!_.isObject(attributes.logger)) {
      throw new Error("Missing logger")
    }
    if (!_.isPlainObject(attributes.consumer)) {
      throw new Error("Missing consumer attributes")
    }

    this.env                = attributes.env
    this.logger             = attributes.logger
    this.consumerAttributes = attributes.consumer
    this.consumer           = null
  }

  initializeConsumer() {
    let self = this

    return new Promise(function(resolve, reject) {
      if (!_.isObject(self.consumerAttributes.ctor)) {
        return reject(new Error("Missing consumer constructor"))
      }

      if (!_.isPlainObject(self.consumerAttributes.attributes)) {
        return reject(new Error("Missing consumer constructor attributes"))
      }

      _.merge(self.consumerAttributes.attributes, {logger: self.logger})
      self.consumer = new self.consumerAttributes.ctor(self.consumerAttributes.attributes)
      return self.consumer.initialize().then(function() {
        resolve(self.consumer)
      }).catch(reject)
    })
  }

  start() {
    let self = this

    return new Promise(function(resolve, reject) {
      return self.initializeConsumer().then(function() {
        return self.consumer.start()
      }).then(resolve).catch(reject)
    })
  }

  stop() {
    let self = this

    return new Promise(function(resolve, reject) {
      if (_.isNull(self.consumer)) {
        return resolve()
      }

      return self.consumer.stop().then(resolve).catch(reject)
    })
  }
}

module.exports = App

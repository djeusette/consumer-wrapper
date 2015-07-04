"use strict";
"use strong";

let amqp         = require("amqplib")
let Promise      = require("bluebird")
let _            = require("lodash")
let AmqpConsumer = require("./amqp_consumer")

class PersisterConsumer extends AmqpConsumer {

  constructor(attributes) {
    super(attributes)

    if (!_.isPlainObject(attributes.store)) {
      throw new Error("Missing store attributes")
    }

    this.storeAttributes = attributes.store
    this.store           = null
  }

  initialize() {
    let self = this

    return new Promise(function(resolve, reject) {
      if (!_.isObject(self.storeAttributes.ctor)) {
        return reject(new Error("Missing store constructor"))
      }

      if (!_.isPlainObject(self.storeAttributes.attributes)) {
        return reject(new Error("Missing store constructor attributes"))
      }

      self.store = new self.storeAttributes.ctor(self.storeAttributes.attributes)
      return self.store.connect().then(function() {
        return self.store.initialize().then(resolve)
      }).catch(reject)
    })
  }

  consumeMessage(msg) {
    let self = this

    return new Promise(function(resolve, reject) {
      self.logMessage(msg)
      // TODO
      resolve()
    })
  }
}

module.exports = PersisterConsumer

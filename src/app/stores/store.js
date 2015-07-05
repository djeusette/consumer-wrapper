"use strict";
"use strong";

let Promise = require("bluebird")
let _       = require("lodash")

class Store {

  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes")
    }
  }

  connect() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  disconnect() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  initialize() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  destroy() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  setup() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  persist(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  upsert(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  update(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  delete(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  findOne(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  findAll(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }

  count(attributes) {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"))
    })
  }
}

module.exports = Store

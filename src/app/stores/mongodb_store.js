"use strict";
"use strong";

let MongoClient = require("mongodb").MongoClient
let Promise     = require("bluebird")
let _           = require("lodash")
let Store       = require("./store")

function parseUri(uri) {
  let regex = /(.+\/\/.+\/.+)\/([^\/\?]+)(\?.+){0,1}$/
  let match = regex.exec(uri)

  if (!match) {
    throw new Error("Malformed URI " + uri)
  }

  let replicatSet = match[3] || ""

  return {
    dbUri          : match[1] + replicatSet,
    collectionName : match[2]
  }
}

class MongoDbStore extends Store {

  constructor(attributes) {
    super(attributes)

    if (!_.isString(attributes.uri)) {
      throw new Error("Missing uri")
    }

    let parsedUri       = parseUri(attributes.uri)
    this.uri            = parsedUri.dbUri
    this.collectionName = parsedUri.collectionName
    this.db             = null
    this.collection     = null
  }

  connect() {
    let self = this

    return new Promise(function(resolve, reject) {
      MongoClient.connect(self.uri, function(err, db) {
        if (!_.isNull(err)) {
          return reject(err)
        }
        self.db = db
        resolve(db)
      })
    })
  }

  initialize() {
    let self = this

    return new Promise(function(resolve, reject) {
      if (_.isNull(self.db)) {
        return reject(new Error("Database instance not found"));
      }

      self.db.createCollection(self.collectionName, {w:1}, function(err, collection) {
        if (!_.isNull(err)) {
          self.db.close(function(closingErr) {
            if (!_.isNull(closingErr)) {
              return reject(closingErr)
            }
            return reject(err)
          })
        }

        self.collection = collection
        resolve(collection)
      })
    })
  }
}

module.exports = MongoDbStore

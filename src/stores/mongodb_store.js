import { MongoClient } from 'mongodb';
import Promise from 'bluebird';
import _ from 'lodash';
import Store from './store';

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

    const parsedUri     = parseUri(attributes.uri)
    this.uri            = parsedUri.dbUri
    this.collectionName = parsedUri.collectionName
    this.db             = null
    this.collection     = null
  }

  connect() {
    const self = this

    return new Promise(function(resolve, reject) {
      MongoClient.connect(self.uri, function(err, db) {
        if (err) {
          return reject(err)
        }
        self.db = db
        resolve(db)
      })
    })
  }

  disconnect() {
    const self = this

    return new Promise(function(resolve, reject) {
      self.db.close(function(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  initialize() {
    const self = this

    return new Promise(function(resolve, reject) {
      if (_.isNull(self.db)) {
        return reject(new Error("Database instance not found"));
      }

      self.db.createCollection(self.collectionName, { w: 1 }, function(err, collection) {
        if (err) {
          self.db.close(function(closingErr) {
            if (closingErr) {
              return reject(closingErr);
            }
            return reject(err);
          });
        }

        self.collection = collection;
        resolve(collection);
      })
    })
  }

  persist(attributes, increments = {}) {
    return this.upsert(attributes, increments);
  }

  update(attributes, increments = {}) {
    return this.genericUpdate(attributes, increments);
  }

  upsert(attributes, increments = {}) {
    return this.genericUpdate(attributes, increments, { w: 1, upsert: true });
  }

  genericUpdate(attributes, increments, options = { w: 1 }) {
    if (!attributes.uid) {
      throw new Error("Missing UID");
    }

    const query = { uid: attributes.uid };

    const payload          = {};
    const dataPayload      = {};
    const unsetDataPayload = {};
    const incrementPayload = {};

    for (let key in Object.keys(attributes)) {
      const value = attributes.key;

      if (value instanceof Buffer) {
        dataPayload[`_attachments.${key}`] = value;
      } else if (_.isNull(value)) {
        unsetDataPayload[`data.${key}`] = value;
      } else {
        dataPayload[`data.${key}`] = value;
      }
    }

    for (let key in Object.keys(increments)) {
      const value = increments.key;
      incrementPayload[`data.${key}`] = value;
    }

    payload['$set']   = dataPayload;
    payload['$unset'] = unsetDataPayload;
    payload['$inc']   = incrementPayload;

    return this.collection.update(query, payload, options);
  }

  delete(uid) {
    return this.collection.remove({ uid: uid});
  }

  findOne(attributes) {
    const { params } = attributes;
    return this.genericFindOne(params);
  }

  findAll(attributes) {
    const { params, skip, limit, sort } = attributes;
    return this.genericFindAll(params, skip, limit, sort);
  }

  formatParams(params) {
    const formattedParams = {}

    for (let key in Object.keys(params)) {
      const value = params.key;

      if (value instanceof Array) {

      } else {
        formattedParams[`data.${key}`] = value;
      }
    }

    return formattedParams;
  }

  count(params) {
    const formattedParams = this.formatParams(params);
    return this.collection.find(formattedParams).count();
  }

  genericFindOne(params) {
    return this.collection.findOne(params);
  }

  genericFindAll(params, skip = null, limit = null, sort = { _id: -1 }) {
    const formattedParams = this.formatParams(params);
    return this.collection.find(formattedParams).sort(sort).skip(skip).limit(limit).toArray();
  }
}

export default MongoDbStore;

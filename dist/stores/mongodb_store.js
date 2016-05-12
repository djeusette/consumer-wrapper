'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongodb = require('mongodb');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function parseUri(uri) {
  var regex = /(.+\/\/.+\/.+)\/([^\/\?]+)(\?.+){0,1}$/;
  var match = regex.exec(uri);

  if (!match) {
    throw new Error("Malformed URI " + uri);
  }

  var replicatSet = match[3] || "";

  return {
    dbUri: match[1] + replicatSet,
    collectionName: match[2]
  };
}

var MongoDbStore = function (_Store) {
  _inherits(MongoDbStore, _Store);

  function MongoDbStore(attributes) {
    _classCallCheck(this, MongoDbStore);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MongoDbStore).call(this, attributes));

    if (!_lodash2.default.isString(attributes.uri)) {
      throw new Error("Missing uri");
    }

    var parsedUri = parseUri(attributes.uri);
    _this.uri = parsedUri.dbUri;
    _this.collectionName = parsedUri.collectionName;
    _this.db = null;
    _this.collection = null;
    return _this;
  }

  _createClass(MongoDbStore, [{
    key: 'connect',
    value: function connect() {
      var self = this;

      return new _bluebird2.default(function (resolve, reject) {
        _mongodb.MongoClient.connect(self.uri, function (err, db) {
          if (err) {
            return reject(err);
          }
          self.db = db;
          resolve(db);
        });
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      var self = this;

      return new _bluebird2.default(function (resolve, reject) {
        self.db.close(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var self = this;

      return new _bluebird2.default(function (resolve, reject) {
        if (_lodash2.default.isNull(self.db)) {
          return reject(new Error("Database instance not found"));
        }

        self.db.createCollection(self.collectionName, { w: 1 }, function (err, collection) {
          if (err) {
            self.db.close(function (closingErr) {
              if (closingErr) {
                return reject(closingErr);
              }
              return reject(err);
            });
          }

          self.collection = collection;
          resolve(collection);
        });
      });
    }
  }, {
    key: 'persist',
    value: function persist(attributes) {
      var increments = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.upsert(attributes, increments);
    }
  }, {
    key: 'update',
    value: function update(attributes) {
      var increments = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.genericUpdate(attributes, increments);
    }
  }, {
    key: 'upsert',
    value: function upsert(attributes) {
      var increments = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return this.genericUpdate(attributes, increments, { w: 1, upsert: true });
    }
  }, {
    key: 'genericUpdate',
    value: function genericUpdate(attributes, increments) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? { w: 1 } : arguments[2];

      if (!attributes.uid) {
        throw new Error("Missing UID");
      }

      var query = { uid: attributes.uid };

      var payload = {};
      var dataPayload = {};
      var unsetDataPayload = {};
      var incrementPayload = {};

      for (var key in Object.keys(attributes)) {
        var value = attributes.key;

        if (value instanceof Buffer) {
          dataPayload['_attachments.' + key] = value;
        } else if (_lodash2.default.isNull(value)) {
          unsetDataPayload['data.' + key] = value;
        } else {
          dataPayload['data.' + key] = value;
        }
      }

      for (var _key in Object.keys(increments)) {
        var _value = increments.key;
        incrementPayload['data.' + _key] = _value;
      }

      payload['$set'] = dataPayload;
      payload['$unset'] = unsetDataPayload;
      payload['$inc'] = incrementPayload;

      return this.collection.update(query, payload, options);
    }
  }, {
    key: 'delete',
    value: function _delete(uid) {
      return this.collection.remove({ uid: uid });
    }
  }, {
    key: 'findOne',
    value: function findOne(attributes) {
      var params = attributes.params;

      return this.genericFindOne(params);
    }
  }, {
    key: 'findAll',
    value: function findAll(attributes) {
      var params = attributes.params;
      var skip = attributes.skip;
      var limit = attributes.limit;
      var sort = attributes.sort;

      return this.genericFindAll(params, skip, limit, sort);
    }
  }, {
    key: 'formatParams',
    value: function formatParams(params) {
      var formattedParams = {};

      for (var key in Object.keys(params)) {
        var value = params.key;

        if (value instanceof Array) {} else {
          formattedParams['data.' + key] = value;
        }
      }

      return formattedParams;
    }
  }, {
    key: 'count',
    value: function count(params) {
      var formattedParams = this.formatParams(params);
      return this.collection.find(formattedParams).count();
    }
  }, {
    key: 'genericFindOne',
    value: function genericFindOne(params) {
      return this.collection.findOne(params);
    }
  }, {
    key: 'genericFindAll',
    value: function genericFindAll(params) {
      var skip = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var limit = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var sort = arguments.length <= 3 || arguments[3] === undefined ? { _id: -1 } : arguments[3];

      var formattedParams = this.formatParams(params);
      return this.collection.find(formattedParams).sort(sort).skip(skip).limit(limit).toArray();
    }
  }]);

  return MongoDbStore;
}(_store2.default);

exports.default = MongoDbStore;
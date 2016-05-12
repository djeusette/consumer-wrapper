'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
  function Store(attributes) {
    _classCallCheck(this, Store);

    if (!_lodash2.default.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }
  }

  _createClass(Store, [{
    key: 'connect',
    value: function connect() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'setup',
    value: function setup() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'persist',
    value: function persist(attributes) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'upsert',
    value: function upsert(attributes) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'update',
    value: function update(attributes) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'delete',
    value: function _delete(uid) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'findOne',
    value: function findOne(attributes) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'findAll',
    value: function findAll(attributes) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'count',
    value: function count(attributes) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }]);

  return Store;
}();

exports.default = Store;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Consumer = function () {
  _createClass(Consumer, null, [{
    key: 'consume',
    value: function consume(attributes) {
      var consumer = new this(attributes);
      return consumer.initialize(attributes).then(function () {
        return consumer.start();
      }).then(function () {
        return consumer;
      });
    }
  }]);

  function Consumer(attributes) {
    _classCallCheck(this, Consumer);

    if (!_lodash2.default.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }

    this.logger = _lodash2.default.isObject(attributes.logger) ? attributes.logger : new _winston2.default.Logger({
      transports: [new _winston2.default.transports.Console({ level: process.env.LOG_LEVEL || 'verbose', colorize: true })]
    });
  }

  _createClass(Consumer, [{
    key: 'consume',
    value: function consume(item) {
      return _bluebird2.default.resolve(this.handler(item));
    }
  }, {
    key: 'initialize',
    value: function initialize(attributes) {
      var self = this;
      return new _bluebird2.default(function (resolve, reject) {
        if (!_lodash2.default.isPlainObject(attributes)) {
          return reject(new Error("Missing attributes"));
        }
        if (!_lodash2.default.isObject(attributes.handler)) {
          return reject(new Error("Missing handler"));
        }
        self.handler = attributes.handler.bind(this);
        resolve(self);
      });
    }
  }, {
    key: 'start',
    value: function start() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }]);

  return Consumer;
}();

exports.default = Consumer;
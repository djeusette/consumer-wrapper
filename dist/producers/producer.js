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

var broker = null;

var Producer = function () {
  _createClass(Producer, null, [{
    key: 'connect',
    value: function connect(attributes) {
      return new this(attributes).connect().tap(function (producer) {
        broker = producer;
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      if (Producer.connected()) {
        return broker.destroy().tap(function () {
          broker = null;
        });
      }
    }
  }, {
    key: 'connected',
    value: function connected() {
      return broker && broker.connection && broker.channel;
    }
  }, {
    key: 'publish',
    value: function publish(content, options) {
      var self = this;
      return new _bluebird2.default(function (resolve, reject) {
        if (!self.connected()) {
          return reject(new Error("Producer not connected"));
        }
        return broker.publish(content, options).then(resolve);
      });
    }
  }]);

  function Producer(attributes) {
    _classCallCheck(this, Producer);

    if (!_lodash2.default.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }

    this.logger = _lodash2.default.isObject(attributes.logger) ? attributes.logger : new _winston2.default.Logger({
      transports: [new _winston2.default.transports.Console({ level: process.env.LOG_LEVEL || 'verbose', colorize: true })]
    });
  }

  _createClass(Producer, [{
    key: 'publish',
    value: function publish(content, options) {
      return new _bluebird2.default(function (resolve, reject) {
        reject(new Error("TODO: implement"));
      });
    }
  }, {
    key: 'connect',
    value: function connect() {
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
  }]);

  return Producer;
}();

exports.default = Producer;
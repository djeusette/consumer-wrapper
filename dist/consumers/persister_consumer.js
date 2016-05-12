'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _amqplib = require('amqplib');

var _amqplib2 = _interopRequireDefault(_amqplib);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _amqp_consumer = require('./amqp_consumer');

var _amqp_consumer2 = _interopRequireDefault(_amqp_consumer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PersisterConsumer = function (_AmqpConsumer) {
  _inherits(PersisterConsumer, _AmqpConsumer);

  function PersisterConsumer(attributes) {
    _classCallCheck(this, PersisterConsumer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PersisterConsumer).call(this, attributes));

    if (!_lodash2.default.isPlainObject(attributes.store)) {
      throw new Error("Missing store attributes");
    }

    _this.storeAttributes = attributes.store;
    _this.store = null;
    return _this;
  }

  _createClass(PersisterConsumer, [{
    key: 'initialize',
    value: function initialize() {
      var self = this;

      return new _bluebird2.default(function (resolve, reject) {
        if (!_lodash2.default.isObject(self.storeAttributes.ctor)) {
          return reject(new Error("Missing store constructor"));
        }

        if (!_lodash2.default.isPlainObject(self.storeAttributes.attributes)) {
          return reject(new Error("Missing store constructor attributes"));
        }

        self.store = new self.storeAttributes.ctor(self.storeAttributes.attributes);
        return self.store.connect().then(function () {
          return self.store.initialize().then(resolve);
        }).catch(reject);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var self = this;

      return self.channel.close().then(function () {
        return self.connection.close();
      }).then(function () {
        return self.store.disconnect();
      });
    }
  }]);

  return PersisterConsumer;
}(_amqp_consumer2.default);

exports.default = PersisterConsumer;
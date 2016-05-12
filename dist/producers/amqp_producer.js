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

var _producer = require('./producer');

var _producer2 = _interopRequireDefault(_producer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AmqpProducer = function (_Producer) {
  _inherits(AmqpProducer, _Producer);

  function AmqpProducer(attributes) {
    _classCallCheck(this, AmqpProducer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AmqpProducer).call(this, attributes));

    if (!_lodash2.default.isPlainObject(attributes.amqp)) {
      throw new Error("Missing AMQP attributes");
    }

    _this.amqp = attributes.amqp;
    _this.connection = null;
    _this.channel = null;
    return _this;
  }

  _createClass(AmqpProducer, [{
    key: 'logMessage',
    value: function logMessage(message) {
      this.logger.log("verbose", "[%s] Publish message \"%s\" on exchange \"%s\" with routing key \"%s\"", process.pid.toString(), message.toString(), this.amqp.exchange, this.amqp.routingKey);
    }
  }, {
    key: 'publish',
    value: function publish(message, options) {
      if (!_lodash2.default.isPlainObject(options)) {
        options = {};
      }

      var self = this;
      return _bluebird2.default.resolve(this.channel.publish(this.amqp.exchange, this.amqp.routingKey, new Buffer(message), options)).tap(function () {
        self.logMessage(message);
      });
    }
  }, {
    key: 'connect',
    value: function connect() {
      var self = this;

      return new _bluebird2.default(function (resolve, reject) {
        if (!_lodash2.default.isString(self.amqp.url)) {
          return reject(new Error("Missing AMQP url"));
        }
        if (!_lodash2.default.isString(self.amqp.exchange)) {
          return reject(new Error("Missing AMQP exchange"));
        }
        if (!_lodash2.default.isString(self.amqp.routingKey)) {
          return reject(new Error("Missing AMQP routingKey"));
        }

        return _amqplib2.default.connect(self.amqp.url).then(function (connection) {
          process.once("SIGINT", function () {
            self.destroy();
          });

          self.connection = connection;

          return connection.createChannel().then(function (channel) {
            self.channel = channel;
            resolve(self);
          });
        }).catch(reject);
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var self = this;
      return self.channel.close().then(function () {
        self.connection.close();
      });
    }
  }]);

  return AmqpProducer;
}(_producer2.default);

exports.default = AmqpProducer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _amqplib = require('amqplib');

var _amqplib2 = _interopRequireDefault(_amqplib);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _consumer = require('./consumer');

var _consumer2 = _interopRequireDefault(_consumer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_AMQP_ATTRIBUTES = {
  url: 'amqp://localhost',
  queue: {
    name: 'queue',
    options: {}
  },
  exchange: {
    name: 'exchange',
    type: 'topic',
    options: {}
  },
  routingKey: '#'
};

var AmqpConsumer = function (_Consumer) {
  _inherits(AmqpConsumer, _Consumer);

  function AmqpConsumer(attributes) {
    _classCallCheck(this, AmqpConsumer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AmqpConsumer).call(this, attributes));

    _this.amqp = _lodash2.default.defaultsDeep(attributes.amqp, DEFAULT_AMQP_ATTRIBUTES);
    _this.connection = null;
    _this.channel = null;
    return _this;
  }

  _createClass(AmqpConsumer, [{
    key: 'consume',
    value: function consume(message) {
      var self = this;
      return _get(Object.getPrototypeOf(AmqpConsumer.prototype), 'consume', this).call(this, message).tap(function () {
        if (!(_lodash2.default.isBoolean(self.amqp.queue.options.noAck) && self.amqp.queue.options.noAck)) {
          self.channel.ack(message);
        }
      }).tap(function () {
        self.logMessage(message);
      });
    }
  }, {
    key: 'logMessage',
    value: function logMessage(message) {
      this.logger.log("verbose", " [%s] %s: '%s'", process.pid.toString(), message.fields.routingKey, message.content.toString());
    }
  }, {
    key: 'start',
    value: function start() {
      var self = this;
      return new _bluebird2.default(function (resolve, reject) {
        if (!_lodash2.default.isPlainObject(self.amqp.queue)) {
          return reject(new Error('Wrong AMQP queue attribute'));
        }
        if (!_lodash2.default.isPlainObject(self.amqp.exchange)) {
          return reject(new Error('Wrong AMQP exchange attribute'));
        }

        return _amqplib2.default.connect(self.amqp.url).then(function (connection) {
          process.once("SIGINT", function () {
            self.stop();
          });

          self.connection = connection;

          return connection.createChannel().then(function (channel) {
            self.channel = channel;

            return resolve(_bluebird2.default.all([channel.assertQueue(self.amqp.queue.name, self.amqp.queue.options), channel.assertExchange(self.amqp.exchange.name, self.amqp.exchange.type, self.amqp.exchange.options), channel.bindQueue(self.amqp.queue.name, self.amqp.exchange.name, self.amqp.routingKey), channel.consume(self.amqp.queue.name, self.consume.bind(self), self.amqp.queue.options)]));
          });
        }).catch(reject);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var self = this;
      return self.channel.close().then(function () {
        return self.connection.close();
      });
    }
  }]);

  return AmqpConsumer;
}(_consumer2.default);

exports.default = AmqpConsumer;
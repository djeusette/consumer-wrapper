'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _main = require('../main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handler = function handler(item) {
  return console.log('Item received', item.content.toString());
};

var promiseHandler = function promiseHandler(item) {
  return new _bluebird2.default(function (resolve, reject) {
    console.log('Item received', item.content.toString());
    resolve(item);
  });
};

var attributes = {
  handler: handler,
  amqp: {
    url: 'amqp://localhost',
    queue: {
      name: 'test',
      options: {}
    },
    exchange: {
      name: 'test',
      type: 'topic',
      options: {}
    },
    routingKey: '#'
  }
};

var consumer = _main.Consumer.consume(attributes);
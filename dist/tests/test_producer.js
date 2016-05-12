'use strict';

var _main = require('../main');

function promiseWhile(predicate, action) {
  function loop() {
    if (!predicate()) return;
    return Promise.resolve(action()).then(loop);
  }
  return Promise.resolve().then(loop);
}

var attributes = {
  amqp: {
    url: 'amqp://localhost',
    queue: 'test',
    exchange: 'test',
    routingKey: '#'
  }
};

_main.Producer.connect(attributes).then(function () {
  var n = 100;
  var predicate = function predicate() {
    return n > 0;
  };
  var action = function action() {
    _main.Producer.publish("Test " + n);
    console.log('Item published', 'Test ' + n);
  };

  promiseWhile(predicate, action).then(function () {
    _main.Producer.disconnect();
  });
});
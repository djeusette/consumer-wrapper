import { Producer } from '../main';

function promiseWhile(predicate, action) {
  function loop() {
    if (!predicate()) return;
    return Promise.resolve(action()).then(loop);
  }
  return Promise.resolve().then(loop);
}

const attributes = {
  amqp: {
    url: 'amqp://localhost',
    queue: 'test',
    exchange: 'test',
    routingKey: '#'
  }
};

Producer.connect(attributes).then(function() {
  let n = 100;
  const predicate = () => (n > 0);
  const action = () => {
    Producer.publish("Test " + n);
    console.log('Item published', 'Test ' + n);
  };

  promiseWhile(predicate, action).then(() => {
    Producer.disconnect()
  });
});

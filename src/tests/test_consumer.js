import Promise from 'bluebird';
import { Consumer } from '../main';

const handler = (item) => (console.log('Item received', item.content.toString()));

const promiseHandler = (item) => {
  return new Promise((resolve, reject) => {
    console.log('Item received', item.content.toString());
    resolve(item);
  });
};

const attributes = {
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

const consumer = Consumer.consume(attributes);

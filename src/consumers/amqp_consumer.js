import amqp from 'amqplib';
import Promise  from 'bluebird';
import _  from 'lodash';
import Consumer from './consumer';

const DEFAULT_AMQP_ATTRIBUTES = {
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

class AmqpConsumer extends Consumer {
  constructor(attributes) {
    super(attributes);

    this.amqp       = _.defaultsDeep(attributes.amqp, DEFAULT_AMQP_ATTRIBUTES);
    this.connection = null;
    this.channel    = null;
  }

  consume(message) {
    const self = this;
    return super.consume(message).tap(function() {
      if (!(_.isBoolean(self.amqp.queue.options.noAck) && self.amqp.queue.options.noAck)) {
        self.channel.ack(message);
      }
    }).tap(function() {
      self.logMessage(message);
    });
  }

  logMessage(message) {
    this.logger.log("verbose", " [%s] %s: '%s'",
      process.pid.toString(),
      message.fields.routingKey,
      message.content.toString());
  }

  start() {
    const self = this;
    return new Promise(function(resolve, reject) {
      if (!_.isPlainObject(self.amqp.queue)) {
        return reject(new Error('Wrong AMQP queue attribute'));
      }
      if (!_.isPlainObject(self.amqp.exchange)) {
        return reject(new Error('Wrong AMQP exchange attribute'));
      }

      return amqp.connect(self.amqp.url).then(function(connection) {
        process.once("SIGINT", function() { self.stop(); });

        self.connection = connection;

        return connection.createChannel().then(function(channel) {
          self.channel = channel;

          return resolve(Promise.all([
              channel.assertQueue(self.amqp.queue.name, self.amqp.queue.options),
              channel.assertExchange(self.amqp.exchange.name, self.amqp.exchange.type, self.amqp.exchange.options),
              channel.bindQueue(self.amqp.queue.name, self.amqp.exchange.name, self.amqp.routingKey),
              channel.consume(self.amqp.queue.name, self.consume.bind(self), self.amqp.queue.options)
            ]));
        });
      }).catch(reject);
    });
  }

  stop() {
    const self = this;
    return self.channel.close().then(function() {
      return self.connection.close();
    });
  }
}

export default AmqpConsumer;

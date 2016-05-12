import amqp from 'amqplib';
import Promise  from 'bluebird';
import _  from 'lodash';
import Producer from './producer';

class AmqpProducer extends Producer {
  constructor(attributes) {
    super(attributes);

    if (!_.isPlainObject(attributes.amqp)) {
      throw new Error("Missing AMQP attributes");
    }

    this.amqp       = attributes.amqp;
    this.connection = null;
    this.channel    = null;
  }

  logMessage(message) {
    this.logger.log("verbose", "[%s] Publish message \"%s\" on exchange \"%s\" with routing key \"%s\"",
      process.pid.toString(),
      message.toString(),
      this.amqp.exchange,
      this.amqp.routingKey);
  }

  publish(message, options) {
    if (!_.isPlainObject(options)) {
      options = {};
    }

    const self = this;
    return Promise.resolve(this.channel.publish(this.amqp.exchange, this.amqp.routingKey, new Buffer(message), options)).tap(function() {
      self.logMessage(message);
    });
  }

  connect() {
    const self = this;

    return new Promise(function(resolve, reject) {
      if (!_.isString(self.amqp.url)) {
        return reject(new Error("Missing AMQP url"));
      }
      if (!_.isString(self.amqp.exchange)) {
        return reject(new Error("Missing AMQP exchange"));
      }
      if (!_.isString(self.amqp.routingKey)) {
        return reject(new Error("Missing AMQP routingKey"));
      }

      return amqp.connect(self.amqp.url).then(function(connection) {
        process.once("SIGINT", function() { self.destroy(); });

        self.connection = connection;

        return connection.createChannel().then(function(channel) {
          self.channel = channel;
          resolve(self);
        });
      }).catch(reject);
    });
  }

  destroy() {
    const self = this;
    return self.channel.close().then(function() {
      self.connection.close();
    });
  }
}

export default AmqpProducer;

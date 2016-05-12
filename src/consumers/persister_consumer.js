import amqp from 'amqplib';
import Promise from 'bluebird';
import _ from 'lodash';
import AmqpConsumer from './amqp_consumer';

class PersisterConsumer extends AmqpConsumer {

  initialize(attributes) {
    const self = this;

    return super.initialize(attributes).then((consumer) => {
      if (!_.isPlainObject(attributes.store)) {
        throw new Error("Missing store attributes");
      }

      if (!_.isObject(attributes.store.ctor)) {
        throw new Error("Missing store constructor");
      }

      if (!_.isPlainObject(attributes.store.attributes)) {
        throw new Error("Missing store constructor attributes");
      }

      const { ctor, attributes: attr } = attributes.store;
      self.store = new ctor(attr);
      return self.store.connect().then(function() {
        return self.store.initialize();
      });
    });
  }

  stop() {
    const self = this;

    return self.channel.close().then(function() {
      return self.connection.close();
    }).then(function() {
      return self.store.disconnect();
    });
  }
}

export default PersisterConsumer;

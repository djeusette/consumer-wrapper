import amqp from 'amqplib';
import Promise from 'bluebird';
import _ from 'lodash';
import AmqpConsumer from './amqp_consumer';

class PersisterConsumer extends AmqpConsumer {

  constructor(attributes) {
    super(attributes)

    if (!_.isPlainObject(attributes.store)) {
      throw new Error("Missing store attributes");
    }

    this.storeAttributes = attributes.store;
    this.store           = null;
  }

  initialize() {
    const self = this;

    return new Promise(function(resolve, reject) {
      if (!_.isObject(self.storeAttributes.ctor)) {
        return reject(new Error("Missing store constructor"));
      }

      if (!_.isPlainObject(self.storeAttributes.attributes)) {
        return reject(new Error("Missing store constructor attributes"));
      }

      self.store = new self.storeAttributes.ctor(self.storeAttributes.attributes);
      return self.store.connect().then(function() {
        return self.store.initialize().then(resolve);
      }).catch(reject);
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

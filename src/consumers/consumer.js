import Promise from 'bluebird';
import _ from 'lodash';
import winston from 'winston';

class Consumer {
  static consume(attributes) {
    const consumer = new this(attributes);
    return consumer.initialize(attributes).then(function() {
      return consumer.start();
    }).then(function() {
      return consumer;
    });
  }

  constructor(attributes) {
    if (!_.isPlainObject(attributes)) {
      throw new Error("Missing attributes");
    }

    this.logger = _.isObject(attributes.logger) ? attributes.logger : new winston.Logger({
      transports: [new winston.transports.Console({level: process.env.LOG_LEVEL || 'verbose', colorize: true})]
    });
  }

  consume(item) {
    return Promise.resolve(this.handler(item));
  }

  initialize(attributes) {
    const self = this;
    return new Promise(function(resolve, reject) {
      if (!_.isPlainObject(attributes)) {
        return reject(new Error("Missing attributes"));
      }
      if (!_.isObject(attributes.handler)) {
        return reject(new Error("Missing handler"));
      }
      self.handler = attributes.handler.bind(this);
      resolve(self);
    });
  }

  start() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }

  stop() {
    return new Promise(function(resolve, reject) {
      reject(new Error("TODO: implement"));
    });
  }
}

export default Consumer;


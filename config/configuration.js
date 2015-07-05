"use strict";
"use strong";

let MongoDbStore      = require("../src/app/stores/mongodb_store")
let PersisterConsumer = require("../src/app/consumers/persister_consumer")

let configuration = {
  production: {
    app: {
      consumer: {
        ctor: PersisterConsumer,
        attributes: {
          amqp: {
            url: "amqp://localhost",
            queue: "message-persister",
            exchange: "messages",
            routingKey: "#"
          },
          store: {
            ctor: MongoDbStore,
            attributes: {
              uri: "mongodb://localhost:27017/message_handler/collection"
            }
          }
        }
      }
    }
  },
  development: {
    app: {
      consumer: {
        ctor: PersisterConsumer,
        attributes: {
          amqp: {
            url: "amqp://localhost",
            queue: "message-persister",
            exchange: "messages",
            routingKey: "#"
          },
          store: {
            ctor: MongoDbStore,
            attributes: {
              uri: "mongodb://localhost:27017/message_handler/collection"
            }
          }
        }
      }
    }
  }
}

module.exports = configuration

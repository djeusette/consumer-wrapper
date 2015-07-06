"use strict";
"use strong";

let ConsumerWrapper = require("./consumer_wrapper")
let Consumer        = require("./app/consumers/consumer")
let AmqpConsumer    = require("./app/consumers/amqp_consumer")

module.exports              = ConsumerWrapper
module.exports.Consumer     = Consumer
module.exports.AmqpConsumer = AmqpConsumer

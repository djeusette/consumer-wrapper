"use strict";
"use strong";

function Configuration(configurationPath, env) {
  let configuration = require(configurationPath)[env]
  if (!configuration)
    throw new Error("No configuration set for environment " + env);
  return configuration
}

module.exports = Configuration

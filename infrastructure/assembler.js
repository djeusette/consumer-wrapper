"use strict";
"use strong";

let winston           = require("winston")
let Configuration     = require("./configuration")

class Assembler {
  constructor(App, configurationPath) {
    if (!App)
      throw new Error("Missing app constructor")
    if (!configurationPath)
      throw new Error("Missing configuration file path")

    this.App               = App;
    this.configurationPath = configurationPath;
    this.env               = process.env.NODE_ENV || "development";
    this.logger            = new winston.Logger({
      transports: [new winston.transports.Console({level: process.env.LOG_LEVEL, colorize: true})]
    });
  }

  loadConfiguration() {
    this.configuration = new Configuration(this.configurationPath, this.env);
  }

  assembleApp() {
    if (this.app)
      throw new Error("An app was assembled already");
    if (!this.configuration)
      throw new Error("Missing configuration");

    let appOptions = {
      logger    : this.logger,
      env       : this.env,
      assembler : this
    };

    if (this.configuration.app) {
      let key;
      for (key of Object.keys(this.configuration.app)) {
        appOptions[key] = this.configuration.app[key];
      }
    }

    this.app = new this.App(appOptions);
  }

  loadCompleteApp() {
    this.loadConfiguration()
    this.assembleApp()
  }

  tearDownApp() {
    console.log("Teardown app")
  }

}

module.exports = Assembler

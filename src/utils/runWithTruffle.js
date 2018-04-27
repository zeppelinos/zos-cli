const Web3 = require('web3')
const TruffleConfig = require("truffle-config");
const TruffleEnvironment = require("truffle-core/lib/environment");

export default function runWithTruffle(script, network) {
  const options = { logger: console }
  const config = TruffleConfig.detect(options)
  config.network = network;
  TruffleEnvironment.detect(config, function(error) {
    if (error) throw error
    global.web3 = new Web3(config.provider)
    global.artifacts = config.resolver
    script()
  })
}

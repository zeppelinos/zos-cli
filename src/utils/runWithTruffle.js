const Web3 = require('web3')
const TruffleConfig = require("truffle-config");
const TruffleEnvironment = require("truffle-core/lib/environment");

export default function runWithTruffle(script) {
  if(!scriptPath) throw 'A script path must be given'
  const config = TruffleConfig.detect(options);
  TruffleEnvironment.detect(config, function(error) {
    if (error) throw error
    global.web3 = new Web3(config.provider)
    // global.artifacts = config.artifacts?
    // TODO: inject artifacts globally
    script()
  })
}

import { FileSystem as fs, Logger } from 'zos-lib'

const log = new Logger('RunWithTruffle')

export default function runWithTruffle(script, network, compile = false) {
  const TRUFFLE_JS_PATH = `${process.cwd()}/truffle.js`
  const TRUFFLE_CONFIG_JS_PATH = `${process.cwd()}/truffle-config.js`

  const truffleFileMissing = !fs.exists(TRUFFLE_JS_PATH) && !fs.exists(TRUFFLE_CONFIG_JS_PATH);
  if (truffleFileMissing) throw Error('You have to provide a truffle.js file, please remember to initialize your project running "truffle init".')
  if (compile) compileWithTruffle()
  initTruffle(network).then(script)
}

function initTruffle(network) {
  if(!network) throw Error('A network name must be provided to execute the requested action.')

  const TruffleConfig = require('truffle-config')
  const config = TruffleConfig.detect({ logger: console })
  config.network = network

  return new Promise((resolve, reject) => {
    const TruffleEnvironment = require('truffle-core/lib/environment')
    TruffleEnvironment.detect(config, function (error) {
      if (error) throw error
      const Web3 = require('web3')
      global.web3 = new Web3(config.provider)
      global.artifacts = config.resolver
      resolve()
    })
  });
}

function compileWithTruffle() {
  log.info("Compiling contracts with truffle")
  const truffleCallback = (err, abstractions, paths) => {
    if (err) log.error(err)
  }

  const TruffleCompile = require('truffle-workflow-compile')
  TruffleCompile.compile(config, truffleCallback)
}

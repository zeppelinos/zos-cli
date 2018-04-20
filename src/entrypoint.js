global.artifacts = artifacts
global.web3 = web3
global.truffleDefaults = artifacts.require('ContractDirectory').class_defaults // TODO: Make less horrible

const program = require('commander')

module.exports = function(cb) {

  // Extend commander to accept a script option
  const context = this;
  program.Command.prototype.script = function(fn) {
    this.action(function() {
      const options = arguments[arguments.length - 1];
      options.from = options.parent.from;
      options.network = options.parent.network || web3.eth.accounts[0];
      fn.apply(context, arguments).then(cb).catch(cb);
    })
  };
  
  // Register global options
  program
    .version(require('../package.json').version)
    .option('--network [network]', 'Truffle network')
    .option('--from [from]', 'Sender account (required for all blockchain operations)')
    
  // Register each script individually
  require('./scripts/init').register(program)

  // Run program
  program.parse(process.argv.slice(2))
}
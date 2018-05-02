const setStdlib = require('../../scripts/set-stdlib')
const runWithTruffle = require('../../utils/runWithTruffle')

module.exports = function(program) {
  program
    .command('set-stdlib <stdlib>')
    .description("Set a standard library for your project.\n  Provide the npm package of the standard library under <stdlib>.")
    .usage('<stdlib> --network <network> [options]')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .option('--no-install', 'Skip installing stdlib npm dependencies')
    .action(function (options) {
      const { from, network, stdlib, install: installDeps } = options
      runWithTruffle(() => setStdlib({ network, from, stdlib, installDeps}), network)
    })
}

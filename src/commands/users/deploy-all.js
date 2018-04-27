const deployAll = require('../../scripts/deploy-all')
const runWithTruffle = require('../../utils/runWithTruffle')

module.exports = function(program) {
  program
    .command('deploy-all')
    .description("Deploy your entire application to the target network, along with the standard library you are using and all its contracts.")
    .usage('--network <network> [options]')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .action(function (options) {
      const { from, network } = options
      runWithTruffle(() => deployAll({ network, from }), network)
    })
}

const vouch = require('../../scripts/vouch')
const runWithTruffle = require('../../utils/runWithTruffle')

module.exports = function(program) {
  program
    .command('vouch <release> <amount>')
    .description(`Vouches a requested amount of ZEP tokens to a given release.
      Provide the <release> address to vouch for.
      Provide the raw-amount of ZEP tokens to be vouched for the given <release>.`)
    .usage('<release> <amount> --network <network>')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .action(function (release, amount, options) {
      const { network, from } = options
      runWithTruffle(() => vouch(release, amount, { network, from }), network)
    })
}

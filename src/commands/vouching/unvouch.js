const unvouch = require('../../scripts/unvouch')
const runWithTruffle = require('../../utils/runWithTruffle')

module.exports = function(program) {
  program
    .command('unvouch <release> <amount>')
    .description(`Unvouches a requested amount of ZEP tokens to a given release.
      Provide the <release> address to unvouch for.
      Provide the raw-amount of ZEP tokens to be unvouched for the given <release>.`)
    .usage('<release> <amount> --network <network>')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .action(function (release, amount, options) {
      const { network, from } = options
      runWithTruffle(() => unvouch(release, amount, { network, from }), network)
    })
}

const register = require('../../scripts/register')
const runWithTruffle = require('../../utils/runWithTruffle')

module.exports = function(program) {
  program
    .command('register <release>')
    .description("Register an already deployed stdlib release to zeppelin_os kernel.\n  " +
      "Provide the <release>  address to be registered")
    .usage('<release> --network <network>')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('-n, --network <network>', 'Provide a network to be used')
    .action(function (release, options) {
      const { network, from } = options
      runWithTruffle(() => register(release, { network, from }), network)
    })
}

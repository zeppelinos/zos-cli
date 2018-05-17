'use strict';

import status from '../scripts/status'
import runWithTruffle from '../utils/runWithTruffle'

module.exports = {
  setup: function(program) {
  program
    .command('status', {noHelp: true})
    .description('Print status information on the deployment of your app in the chosen network')
    .usage('--network <network>')
    .option('-n, --network <network>', 'Provide a network to be used')
    .action(function (options) {
      const { network } = options
      runWithTruffle(async () => await status({ network }), network)
    })
  }
}

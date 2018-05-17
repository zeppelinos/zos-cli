'use strict';

import push from '../scripts/push'
import runWithTruffle from '../utils/runWithTruffle'

function registerPush(program) {
  program
    .command('push', {noHelp: true})
    .description('Pushes your project to the specified network')
    .usage('--network <network> [options]')
    .option('-f, --from <from>', 'Set the transaction sender address')
    .option('-n, --network <network>', 'Provide a network to be used')
    .option('--skip-compile', 'Skips contract compilation')
    .option('--deploy-stdlib', 'Deploys a copy of the stdlib (if any) instead of using the one published to the network (useful in local development networks)')
    .option('--reupload', 'Reuploads all contracts')
    .action(action)
}

function action(options) {
  const { from, network, skipCompile, deployStdlib, reupload } = options
  const txParams = from ? { from } : {}
  runWithTruffle(async () => await push({ network, deployStdlib, reupload, txParams }), network, ! skipCompile)
}

module.exports = registerPush
module.exports.action = action

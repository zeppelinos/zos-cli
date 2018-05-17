'use strict';

import push from './push'
import linkStdlib from '../scripts/link-stdlib'

module.exports = {
  setup: function(program) {
    program
      .command('link <stdlib>', {noHelp: true})
      .usage('<stdlib> [options]')
      .description('Links project with a standard library.\n  <stdlib> is the npm package name of the standard library.')
      .option('--no-install', 'Skip installing stdlib npm dependencies')
      .option('--push <network>', 'Push your changes to the specified network')
      .option('-f, --from <from>', 'Set the transactions sender in case you run with --push')
      .action(async function (stdlibNameVersion, options) {
        const installDeps = options.install
        await linkStdlib({ stdlibNameVersion, installDeps })
        if(options.push) push.action({ network: options.push, from: options.from })
      })
  }
}

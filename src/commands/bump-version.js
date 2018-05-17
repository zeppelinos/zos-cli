'use strict';

import push from './push'
import bumpVersion from '../scripts/bump-version'

module.exports = {
  setup: function(program) {
    program
      .command('bump <version>', {noHelp: true})
      .usage('<version> [options]')
      .description('Bump your project to a new <version>.')
      .option('--link <stdlib>', 'Link to new standard library version')
      .option('--no-install', 'Skip installing stdlib dependencies')
      .option('--push <network>', 'Push your changes to the specified network')
      .option('-f, --from <from>', 'Specify the transaction sender address for --push')
      .action(async function (version, options) {
        const { link: stdlibNameVersion, install: installDeps } = options
        await bumpVersion({ version, stdlibNameVersion, installDeps })
        if(options.push) push.action({ network: options.push, from: options.from })
      })
  }
}

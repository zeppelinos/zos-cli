'use strict';

import push from './push'
import init from '../scripts/init'
import initLib from '../scripts/init-lib'

const signature = 'init <project> [version]'
const description = `initialize your ZeppelinOS project. Provide a <project> name and optionally a [version] number`

module.exports = {
  signature, description,
  setup: function(program) {
    program
      .command(signature, {noHelp: true})
      .usage('<project> [version]')
      .description(description)
      .option('--lib', 'Create a standard library instead of a regular application')
      .option('--force', 'Overwrite existing project if there is one')
      .option('--link <stdlib>', 'Link to standard library')
      .option('--no-install', 'Skip installing stdlib dependencies') 
      .option('--push <network>', 'Push changes to the specified network')
      .option('-f, --from <from>', 'Specify transaction sender address for --push')
      .action(async function (name, version, options) {
        if (options.lib) {
          if (options.stdlib)
            throw Error('Cannot set a stdlib in a library project')
          await initLib({ name, version })
        } else {
          const { stdlib: stdlibNameVersion, install: installDeps } = options
          await init({ name, version, stdlibNameVersion, installDeps })
        }
        
        if (options.push) {
          push.action({ network: options.push, from: options.from })
        }
      })
  }
}

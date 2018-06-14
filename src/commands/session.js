'use strict';

import { FileSystem as fs } from 'zos-lib'
import { Logger } from 'zos-lib'

const signature = 'session <network>'
const description = 'by providing <network>, commands like create, ' +
                    'freeze, push, status and upgrade will use <network> ' +
                    'unless overriden.'

module.exports = {
  signature, description,
  register: function(program) {
    program
      .command(signature, {noHelp: true})
      .usage('<network>')
      .description(description)
      .action(async function (networkName, options) {
        fs.write('/tmp/.zos_session', networkName)
        let log = new Logger('commands/session')
        log.info('Using "' + networkName + '" as default network unless overriden.')
      })
  }
}

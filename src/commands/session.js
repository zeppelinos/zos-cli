'use strict';

import { setNetwork as setNetwork } from '../scripts/session';

const signature = 'session';
const description = 'by providing --network <network>, commands like create, ' +
                    'freeze, push, status and upgrade will use <network> ' +
                    'unless overriden. Use --remove to undo.';

module.exports = {
  signature, description,
  register: function(program) {
    program
      .command(signature, {noHelp: false})
      .usage('Either --network <network> or --remove')
      .option('--network <network>')
      .option('--remove')
      .description(description)
      .action(setNetwork);
  }
}

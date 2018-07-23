'use strict';

import verify from '../scripts/verify'
import runWithTruffle from '../utils/runWithTruffle'

const name = 'verify'
const signature = `${name} <contract-alias>`
const description = 'verify a contract with etherchain. Provide a contract name.'

const register = program => program
  .command(signature, { noHelp: true })
  .description(description)
  .option('-n, --network <network>', 'network where to verify the contract')
  .option('--optimizer <optimizer>', 'specify if optimizer is enabled or disabled.')
  .option('--runs <runs>', 'specify number of runs if optimizer enabled.')
  .action(action);


function action(contractAlias, options) {
  const { optimizer, runs } = options
  if (optimizer === 'enabled' && !runs) {
    throw new Error('Cannot verify contract without defining number of optimizer runs')
  }
  runWithTruffle(() => verify(contractAlias, options), options)
}

export default { name, signature, description, register, action }


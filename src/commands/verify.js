'use strict';

import verify from '../scripts/verify'
import runWithTruffle from '../utils/runWithTruffle'

const name = 'verify'
const signature = `${name} <ContractName>`
const description = 'verify a contract with etherchain. Provide a contract name.'

const register = program => program
  .command(signature, { noHelp: true })
  .description(description)
  .option('-n, --network <network>', 'network where to verify the contract')
  .option('--optimizer <optimizer>', 'specify if optimizer is enabled or disabled.')
  .option('--runs <runs>', 'specify number of runs is optimizer enabled.')
  .option('--timeout <timeout>', 'timeout in seconds for blockchain comunications')
  .action(action);


function action(contractName, options) {
  const { optimizer, runs } = options;
  if (optimizer === 'enabled' && !runs) {
    throw Error('Cannot verify without defining number of runs')
  }

  verify(contractName, options)
}

export default { name, signature, description, register, action }



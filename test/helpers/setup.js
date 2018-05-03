import Logger from '../../src/utils/Logger'
import Stdlib from '../../src/models/Stdlib'
import truffleContract from 'truffle-contract'
import StdlibInstaller from '../../src/zos-lib/stdlib/StdlibInstaller'
import ContractsProvider from '../../src/models/ContractsProvider'

const DEFAULT_TX_PARAMS = {
  gas: 6721975,
  gasPrice: 100000000000,
  from: web3.eth.accounts[0]
}

export default function(testName, test) {
  muteLogging()
  doNotInstallStdlib()
  provideContractsFromTruffle()
  contract(testName, test)
}

function muteLogging() {
  Logger.prototype.info = msg => {}
  Logger.prototype.error = msg => {}
}

function doNotInstallStdlib() {
  StdlibInstaller.call = stdlibNameAndVersion => new Stdlib(stdlibNameAndVersion)
}

function provideContractsFromTruffle() {
  ContractsProvider.getByJSONData = (data) => {
    const contract = truffleContract(data)
    contract.setProvider(web3.currentProvider)
    contract.defaults(DEFAULT_TX_PARAMS)
    return contract
  }
}

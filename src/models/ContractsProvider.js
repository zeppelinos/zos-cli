import env from '../utils/environment'
import truffleContract from 'truffle-contract'
import truffleProvision from 'truffle-provisioner'

const ContractsProvider = {
  kernel() {
    return this.getByJSONData(require('zos-kernel/build/contracts/Kernel.json'))
  },

  release() {
    return this.getByJSONData(require('zos-kernel/build/contracts/Release.json'))
  },

  zepToken() {
    return this.getByJSONData(require('zos-kernel/build/contracts/ZepToken.json'))
  },

  vouching() {
    return this.getByJSONData(require('zos-kernel/build/contracts/Vouching.json'))
  },

  getFromArtifacts(name) {
    return artifacts.require(name)
  },

  getByName(name) {
    const data = require(`../../build/contracts/${name}.json`)
    return this.getByJSONData(data)
  },

  getByJSONData(data) {
    const contract = truffleContract(data)
    env.ifTest(
      // Truffle injects entirely different objects in testing and in exec, hence this if
      () => this.provideForTesting(contract),
      () => this.provideWithTruffle(contract))
    return contract
  },

  provideWithTruffle(contract) {
    truffleProvision(contract, this.artifactsDefaults())
  },

  provideForTesting(contract) {
    contract.setProvider(web3.currentProvider)
    contract.defaults(this.testingDefaults())
  },

  artifactsDefaults() {
    if(!artifacts) throw "Could not retrieve truffle defaults"
    return artifacts.options || {}
  },

  testingDefaults() {
    return {
      gas: 6721975,
      gasPrice: 100000000000,
      from: web3.eth.accounts[0]
    }
  }
}

export default ContractsProvider

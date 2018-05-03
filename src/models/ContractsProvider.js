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
    truffleProvision(contract, this.artifactsDefaults())
    return contract
  },

  artifactsDefaults() {
    if(!artifacts) throw "Could not retrieve truffle defaults"
    return artifacts.options || {}
  },
}

export default ContractsProvider

import fs from 'fs'
import _ from 'lodash'
import StdlibDeployer from "./stdlib/StdlibDeployer"
import ContractsProvider from "../models/ContractsProvider"
import AppManagerDeployer from "./app_manager/AppManagerDeployer"

export default {
  async call(owner, packageData = null) {
    this.owner = owner
    this.txParams = { from: owner }
    if(!packageData) packageData = JSON.parse(fs.readFileSync('package.zos.json'))
    const appManager = await AppManagerDeployer.call(owner, packageData.version)
    const directory = appManager.currentDirectory()
    await this._deployStdlib(directory, packageData)
    await this._deployAllContracts(directory, packageData)
    return appManager
  },

  async _deployAllContracts(directory, packageData) {
    await Promise.all(_.map(packageData.contracts, async (contractName, contractAlias) => {
      const contractClass = await ContractsProvider.getFromArtifacts(contractName)
      const deployed = await contractClass.new(this.txParams)
      await directory.setImplementation(contractAlias, deployed.address, this.txParams)
    }))
  },

  async _deployStdlib(directory, packageData) {
    if (!_.isEmpty(packageData.stdlib)) {
      const stdlibAddress = await StdlibDeployer.call(this.owner, packageData.stdlib.name)
      await directory.setStdlib(stdlibAddress, this.txParams)
    }
  }
}

import AppManagerWrapper from "./AppManagerWrapper"
import ContractsProvider from "../../models/ContractsProvider"

export default class AppManagerProvider {
  async from(owner, address) {
    this.fetchPackagedAppManager(address)
    await this.fetchFactory()
    await this.fetchPackage()
    await this.fetchAppDirectory()
    return new AppManagerWrapper(owner, this.packagedAppManager, this.factory, this.appDirectory, this.package, this.version)
  }

  fetchPackagedAppManager(address) {
    const PackagedAppManager = ContractsProvider.getByName('PackagedAppManager')
    this.packagedAppManager = new PackagedAppManager(address)
  }
  
  async fetchAppDirectory() {
    const AppDirectory = ContractsProvider.getByName('AppDirectory')
    this.version = await this.packagedAppManager.version()
    const appDirectoryAddress = await this.package.getVersion(this.version)
    this.appDirectory = new AppDirectory(appDirectoryAddress)
  }
  
  async fetchPackage() {
    const Package = ContractsProvider.getByName('Package')
    const packageAddress = await this.packagedAppManager.package()
    this.package = new Package(packageAddress)
  } 

  async fetchFactory() {
    const UpgradeabilityProxyFactory = ContractsProvider.getByName('UpgradeabilityProxyFactory')
    const factoryAddress = await this.packagedAppManager.factory()
    this.factory = new UpgradeabilityProxyFactory(factoryAddress)
  }
}

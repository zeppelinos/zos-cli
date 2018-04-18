const AppManager = artifacts.require('PackagedAppManager');
const AppDirectory = artifacts.require('AppDirectory');
const Package = artifacts.require('Package');
const UpgradeabilityProxyFactory = artifacts.require('UpgradeabilityProxyFactory');

class AppManagerWrapper {

  constructor(owner) {
    this.owner = owner;
  }

  async deployNewAppManager(initialVersion) {
    this.factory = await UpgradeabilityProxyFactory.new({ from: this.owner });
    this.package = await Package.new({ from: this.owner });
    const directory = await AppDirectory.new(0, { from: this.owner });
    await this.package.addVersion(initialVersion, this.directory.address, { from: this.owner });
    this.directories = {
      [initialVersion]: directory
    };
    this.version = initialVersion;
    this.appManager = await AppManager.new(this.package.address, initialVersion, this.factory.address, { from: this.owner });
  }

  async connectWithAppManager(address) {
    this.appManager = await AppManager.at(address);
    this.package = await this.manager.package();
    this.factory = await this.manager.factory();
    this.version = await this.manager.version();
    this.directories[this.version] = await this.package.getVersion(this.version);
  }

  async addNewVersion(versionName) {
    const directory = await AppDirectory.new(0, { from: this.owner });
    await this.package.addVersion(versionName, directory.address, { from: this.owner });
    await this.appManager.setVersion(versionName, { from: this.owner });
    this.directories[versionName] = directory;
    this.version = versionName;
  }

  async setImplementationOnActiveDirectory(contractClass, contractName) {
    const implementation = await contractClass.new({ from: this.owner });
    const directory = this.getActiveDirectory();
    await directory.setImplementation(contractName, implementation.address, { from: this.owner });
  }

  getActiveDirectory() {
    return this.directories[this.version];
  }
}

export default AppManager;

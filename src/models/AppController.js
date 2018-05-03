import Logger from '../utils/Logger';
import { parseJsonIfExists, writeJson } from "../zos-lib/utils/FileSystem";
import _ from 'lodash';
import ContractsProvider from "../zos-lib/utils/ContractsProvider";
import AppManagerProvider from "../zos-lib/app_manager/AppManagerProvider";
import AppManagerDeployer from "../zos-lib/app_manager/AppManagerDeployer";
import StdlibProvider from './stdlib/StdlibProvider';
import StdlibDeployer from './stdlib/StdlibDeployer';
import Stdlib from './stdlib/Stdlib';

const log = new Logger('AppController');

const DEFAULT_VERSION = '0.1.0';
const EMPTY_NETWORK_PACKAGE = {
  app: { },
  proxies: { },
  contracts: { },
};

export default class AppController {
  constructor(packageFileName) {
    this.packageFileName = packageFileName || 'package.zos.json';
  }

  onNetwork(network, txParams, networkFileName) {
    return new NetworkAppController(this, network, txParams, networkFileName);
  }

  init(name, version) {
    if (this.package.name) {
      throw new Error(`Cannot initialize already initialized package ${this.package.name}`)
    }
    
    this.package.name = name;
    this.package.version = version || DEFAULT_VERSION;
    this.package.contracts = {};
  }

  newVersion(version) {
    if (!version) {
      throw new Error('Missign required argument version for initializing new version')
    }
    this.package.version = version;

    // TODO: Do not clean up contracts listing and stdlib, inherit from previous version
    this.package.contracts = {};
    delete this.package['stdlib'];
  }

  setStdlib(stdlibNameVersion, installDeps = false) {
    if (stdlibNameVersion) {
      const stdlib = new Stdlib(stdlibNameVersion);
      if (installDeps) stdlib.install();
      this.package.stdlib = {
        name: stdlib.getName(),
        version: stdlib.getVersion()
      };
    }
  }

  hasStdlib() {
    return !_.isEmpty(this.package.stdlib);
  }

  addImplementation(contractAlias, contractName) {
    this.package.contracts[contractAlias] = contractName;
  }

  get package() {
    if (!this._package) {
      this._package = parseJsonIfExists(this.packageFileName) || {};
    }
    return this._package;
  }

  async getContractClass(contractAlias) {
    const contractName = this.package.contracts[contractAlias];
    if (contractName) {
      return ContractsProvider.getFromArtifacts(contractName);
    } else if (this.hasStdlib()) {
      const stdlib = new Stdlib(this.package.stdlib.name);
      return await stdlib.getContract(contractAlias);
    } else {
      throw new Error(`Could not find ${contractAlias} contract in zOS package file`);
    }
  }

  writePackage() {
    writeJson(this.packageFileName, this.package);
    log.info(`Successfully written ${this.packageFileName}`)
  }
}

class NetworkAppController {
  constructor(appController, network, txParams, networkFileName) {
    this.appController = appController;
    this.txParams = txParams;
    this.network = network;
    this.networkFileName = networkFileName || appController.packageFileName.replace(/\.zos\.json\s*$/, `.zos.${network}.json`);
    if (this.networkFileName == appController.packageFileName) {
      throw new Error(`Cannot create network file name from ${appController.packageFileName}`);
    }
  }

  async sync() {
    await this.initApp()
    await this.syncVersion()
    await this.fetchProvider()
    await this.uploadContracts()
    await this.setStdlib()
  }

  async deployStdlib() {
    if (!this.appController.hasStdlib()) {
      delete this.networkPackage['stdlib'];
      return;
    }

    const stdlibAddress = await StdlibDeployer.call(this.package.stdlib.name, this.txParams);
    this.networkPackage.stdlib = { address: stdlibAddress, customDeploy: true, ... this.package.stdlib };
  }

  async createProxy(contractAlias, initMethod, initArgs) {
    if (contractAlias === undefined) throw new Error('Missing required argument contractAlias for createProxy')

    await this.loadApp();
    const contractClass = await this.appController.getContractClass(contractAlias);
    const proxyInstance = await this.appManagerWrapper.createProxy(contractClass, contractAlias, initMethod, initArgs);
    
    const proxyInfo = {
      address: proxyInstance.address,
      version: this.appManagerWrapper.version
    };

    const proxies = this.networkPackage.proxies;
    if (!proxies[contractAlias]) proxies[contractAlias] = [];
    proxies[contractAlias].push(proxyInfo);
  }

  async upgradeProxy(contractAlias, proxyAddress, initMethod, initArgs) {
    if (contractAlias === undefined) throw new Error(`Must provide a contract name`)

    const proxyInfo = this.findProxy(contractAlias, proxyAddress);
    if (!proxyInfo) throw new Error(`Could not find a ${contractAlias} proxy with address ${proxyAddress}`)

    await this.loadApp();
    const contractClass = await this.appController.getContractClass(contractAlias)
    await this.appManagerWrapper.upgradeProxy(proxyAddress, contractClass, contractAlias, initMethod, initArgs)

    proxyInfo.version = this.appManagerWrapper.version
  }

  findProxy(contractAlias, proxyAddress) {
    const proxies = this.networkPackage.proxies;
    if (_.isEmpty(proxies[contractAlias])) return null;
    if (proxies[contractAlias].length > 1 && proxyAddress === undefined) throw new Error(`Must provide a proxy address for contracts that have more than one proxy`)
    
    const proxyInfo = proxies[contractAlias].length === 1
      ? proxies[contractAlias][0]
      : _.find(proxies[contractAlias], proxy => proxy.address == proxyAddress);

    return proxyInfo;
  }

  get package() {
    return this.appController.package;
  }

  get networkPackage() {
    if (!this._networkPackage) {
      this._networkPackage = parseJsonIfExists(this.networkFileName) || _.cloneDeep(EMPTY_NETWORK_PACKAGE);
    }
    return this._networkPackage;
  }

  writeNetworkPackage() {
    writeJson(this.networkFileName, this.networkPackage);
    log.info(`Successfully written ${this.networkFileName}`)
  }

  async initApp() {
    const address = this.networkPackage.app && this.networkPackage.app.address;
    this.appManagerWrapper = address
      ? await AppManagerProvider.from(address, this.txParams)
      : await AppManagerDeployer.call(this.package.version, this.txParams);
    this.networkPackage.app.address = this.appManagerWrapper.address();
  }

  async loadApp() {
    const address = this.networkPackage.app && this.networkPackage.app.address;
    if (!address) throw new Error("Must deploy app to network");
    this.appManagerWrapper = await AppManagerProvider.from(address, this.txParams);
  }

  async syncVersion() {
    // TODO: Why is version on root level in package but within app in network?
    const requestedVersion = this.package.version;
    const currentVersion = this.appManagerWrapper.version;
    if (requestedVersion !== currentVersion) {
      log.info(`Creating new version ${requestedVersion}`);
      await this.appManagerWrapper.newVersion(requestedVersion);
    }
    this.networkPackage.app.version = requestedVersion;
  }

  async fetchProvider() {
    const currentProvider = this.appManagerWrapper.currentDirectory();
    log.info(`Current provider is at ${currentProvider.address}`);
    this.networkPackage.provider = { address: currentProvider.address };
  }

  async uploadContracts() {
    // TODO: Store the implementation's hash or full source code to avoid unnecessary deployments
    return Promise.all(_.map(this.package.contracts, async (contractName, contractAlias) => {
      const contractClass = ContractsProvider.getFromArtifacts(contractName);
      log.info(`Uploading ${contractName} implementation for ${contractAlias}`);
      const contractInstance = await this.appManagerWrapper.setImplementation(contractClass, contractAlias);
      log.info(`Uploaded ${contractName} at ${contractInstance.address}`);
      this.networkPackage.contracts[contractAlias] = contractInstance.address;
    }));
  }

  async setStdlib() {
    if (!this.appController.hasStdlib()) {
      await this.appManagerWrapper.setStdlib();
      delete this.networkPackage['stdlib'];
      return;
    }

    const networkStdlib = this.networkPackage.stdlib;
    const hasNetworkStdlib = !_.isEmpty(networkStdlib);
    const hasCustomDeploy = hasNetworkStdlib && networkStdlib.customDeploy;
    const customDeployMatches = hasCustomDeploy && networkStdlib.name === this.package.stdlib.name;

    if (customDeployMatches) {
      log.info(`Using existing custom deployment of stdlib at ${networkStdlib.address}`);
      await this.appManagerWrapper.setStdlib(networkStdlib.address);
      return;
    }

    // TODO: Check that package version matches the requested one
    log.info(`Connecting to public deployment of ${this.package.stdlib.name} in ${this.network}`);
    const stdlibAddress = StdlibProvider.from(this.package.stdlib.name, this.network);
    await this.appManagerWrapper.setStdlib(stdlibAddress);
    this.networkPackage.stdlib = { address: stdlibAddress, ... this.package.stdlib };
  }
}
import Logger from '../utils/Logger';
import { parseJsonIfExists, writeJson } from "../zos-lib/utils/FileSystem";
import _ from 'lodash';
import ContractsProvider from "../zos-lib/utils/ContractsProvider";
import AppManagerProvider from "../zos-lib/app_manager/AppManagerProvider";
import AppManagerDeployer from "../zos-lib/app_manager/AppManagerDeployer";
import StdlibProvider from './stdlib/StdlibProvider';
import StdlibDeployer from './stdlib/StdlibDeployer';
import Stdlib from './stdlib/Stdlib';
import NetworkAppController from './NetworkAppController';

const log = new Logger('AppController');

const DEFAULT_VERSION = '0.1.0';

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

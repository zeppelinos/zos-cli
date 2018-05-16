import _ from 'lodash';
import Stdlib from '../stdlib/Stdlib';
import NetworkAppController from '../network/NetworkAppController';
import BasePackageController from './BasePackageController';

export default class AppController extends BasePackageController {
  constructor(packageFileName) {
    super(packageFileName);
    if (this.packageData.lib) {
      throw Error("Cannot create an application controller for a library");
    }
  }

  onNetwork(network, txParams, networkFileName) {
    return new NetworkAppController(this, network, txParams, networkFileName);
  }

  async linkStdlib(stdlibNameVersion, installDeps = false) {
    if (stdlibNameVersion) {
      const stdlib = new Stdlib(stdlibNameVersion);
      if (installDeps) await stdlib.install();
      this.packageData.stdlib = {
        name: stdlib.getName(),
        version: stdlib.getVersion()
      };
    }
  }

  hasStdlib() {
    return !_.isEmpty(this.packageData.stdlib);
  }

  isLib() {
    return false;
  }
}

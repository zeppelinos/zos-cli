import _ from 'lodash';
import Stdlib from '../stdlib/Stdlib';
import StdlibInstaller from '../stdlib/StdlibInstaller';
import NetworkAppController from '../network/NetworkAppController';
import LocalBaseController from './LocalBaseController';

export default class LocalAppController extends LocalBaseController {
  constructor(packageFileName, allowLib=false) {
    super(packageFileName);
    if (this.packageData.lib && !allowLib) {
      throw Error("Cannot create an application controller for a library");
    }
  }

  onNetwork(network, txParams, networkFileName) {
    return new NetworkAppController(this, network, txParams, networkFileName);
  }

  async linkStdlib(stdlibNameVersion, installDeps = false) {
    if (! stdlibNameVersion) throw Error("Must provide a standard library name and version");
    let stdlib;

    if (installDeps) {
      stdlib = await StdlibInstaller.call(stdlibNameVersion);
    } else {
      stdlib = new Stdlib(stdlibNameVersion);
    }

    this.packageData.stdlib = {
      name: stdlib.getName(),
      version: stdlib.getVersion()
    }
  }

  hasStdlib() {
    return !_.isEmpty(this.packageData.stdlib);
  }

  isLib() {
    return false;
  }
}

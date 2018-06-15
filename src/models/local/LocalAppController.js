import Stdlib from '../stdlib/Stdlib';
import StdlibInstaller from '../stdlib/StdlibInstaller';
import LocalBaseController from './LocalBaseController';
import NetworkAppController from '../network/NetworkAppController';

export default class LocalAppController extends LocalBaseController {
  constructor(packageFileName, allowLib = false) {
    super(packageFileName);
    if (this.packageFile.isLib() && !allowLib) {
      throw Error("Cannot create an application controller for a library");
    }
  }

  onNetwork(network, txParams, networkFileName) {
    return new NetworkAppController(this, network, txParams, networkFileName);
  }

  async linkStdlib(stdlibNameVersion, installLib = false) {
    if(stdlibNameVersion) {
      const stdlib = installLib
        ? await StdlibInstaller.call(stdlibNameVersion)
        : new Stdlib(stdlibNameVersion)

      const { name, version } = stdlib
      this.packageFile.stdlib = { name, version }
    }
  }
}

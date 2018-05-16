import BasePackageController from './BasePackageController';
import NetworkLibController from '../network/NetworkLibController';

export default class LibController extends BasePackageController {
  constructor(packageFileName) {
    super(packageFileName);
  }

  onNetwork(network, txParams, networkFileName) {
    return new NetworkLibController(this, network, txParams, networkFileName);
  }

  init(name, version) {
    super.init(name, version);
    this.packageData.lib = true;
  }

  isLib() {
    return true;
  }
}

import LocalBaseController from './LocalBaseController';
import NetworkLibController from '../network/NetworkLibController';

export default class LocalLibController extends LocalBaseController {
  constructor(packageFileName) {
    super(packageFileName);
  }

  init(name, version, force = false) {
    super.init(name, version, force);
    this.packageFile.lib = true;
  }

  onNetwork(network, txParams, networkFileName) {
    return new NetworkLibController(this, network, txParams, networkFileName);
  }
}

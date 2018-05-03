import Logger from '../../utils/Logger'
import DistributionWrapper from "./DistributionWrapper";
import ContractsProvider from "../../models/ContractsProvider";

const log = new Logger('DistributionProvider')

export default {
  from(owner, address) {
    this._fetchPackage(address);
    return new DistributionWrapper(owner, this.package)
  },

  _fetchPackage(address) {
    log.info('Deploying new Package...')
    const Package = ContractsProvider.getByName('Package')
    this.package = new Package(address)
    log.info(`Deployed Package ${this.package.address}`)
  }
}

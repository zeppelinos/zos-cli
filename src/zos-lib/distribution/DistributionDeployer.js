import DistributionWrapper from "./DistributionWrapper"
import ContractsProvider from "../../models/ContractsProvider"

export default {
  async call(owner) {
    this.txParams = { from: owner }
    await this._createPackage();
    return new DistributionWrapper(owner, this.package)
  },

  async _createPackage() {
    const Package = ContractsProvider.getByName('Package')
    this.package = await Package.new(this.txParams)
  }
}

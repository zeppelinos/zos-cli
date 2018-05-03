import KernelWrapper from "./KernelWrapper";
import ContractsProvider from '../../models/ContractsProvider'

export default {
  async from(owner, address) {
    this._fetchKernel(address)
    await this._fetchZepToken()
    await this._fetchVouching()
    return new KernelWrapper(owner, this.kernel, this.zepToken, this.vouching)
  },

  _fetchKernel(address) {
    const Kernel = ContractsProvider.kernel()
    this.kernel = new Kernel(address)
  },

  async _fetchZepToken() {
    const ZepToken = ContractsProvider.zepToken()
    const zepTokenAddress = await this.kernel.token()
    this.zepToken = new ZepToken(zepTokenAddress)
  },

  async _fetchVouching() {
    const Vouching = ContractsProvider.vouching()
    const vouchingAddress = await this.kernel.vouches()
    this.vouching = new Vouching(vouchingAddress)
  }
}

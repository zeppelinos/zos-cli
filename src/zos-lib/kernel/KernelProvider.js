import KernelWrapper from "./KernelWrapper";
import ContractsProvider from '../../models/ContractsProvider'

export default {
  async from(address, txParams = {}) {
    this._fetchKernel(address)
    await this._fetchZepToken()
    await this._fetchVouching()
    return new KernelWrapper(this.kernel, this.zepToken, this.vouching, txParams)
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

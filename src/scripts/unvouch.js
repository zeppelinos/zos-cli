import kernelAddress from '../utils/kernelAddress'
import KernelProvider from "../zos-lib/kernel/KernelProvider";

async function unvouch(releaseAddress, rawAmount, { network, from }) {
  if(!releaseAddress) throw 'You must provide a release address to unvouch from'
  if(!rawAmount) throw 'You must provide an amount of ZEP tokens to unvouch'
  const address = kernelAddress(network)

  const data = ''
  const amount = new web3.BigNumber(rawAmount)
  const kernel = await KernelProvider.from(from, address)
  await kernel.validateCanUnvouch(releaseAddress, amount)

  try {
    await kernel.unvouch(releaseAddress, amount, data)
  } catch (error) {
    console.error('There was an error trying to unvouch your tokens.', error)
  }
}

module.exports = unvouch

import kernelAddress from '../utils/kernelAddress'
import KernelProvider from "../zos-lib/kernel/KernelProvider";

async function register(releaseAddress, { network, from }) {
  if(!releaseAddress) throw 'You must provide a release address'
  const address = kernelAddress(network)
  const kernel = await KernelProvider.from(from, address)
  await kernel.validateCanRegister(releaseAddress)

  try {
    await kernel.register(releaseAddress)
  } catch (error) {
    console.error('There was an error trying to register your release.', error)
  }
}

module.exports = register

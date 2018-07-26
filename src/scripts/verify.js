import ControllerFor from '../models/network/ControllerFor'

export default function verify(contractAlias, { network = 'mainnet', txParams = {}, networkFile = undefined, optimizer = false, optimizerRuns = 200, remote = 'etherchain' }) {
  const controller = ControllerFor(network, txParams, networkFile)
  controller.checkLocalContractDeployed(contractAlias, true)
  controller.verifyAndPublishContract(contractAlias, optimizer, optimizerRuns, remote)
}

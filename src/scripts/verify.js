import ControllerFor from '../models/network/ControllerFor'
import ZosPackageFile from '../models/files/ZosPackageFile'
import ZosNetworkFile from '../models/files/ZosNetworkFile'

export default function verify(contractAlias, { network = 'mainnet', txParams = {}, networkFile = undefined, optimizer = false, runs = undefined, remote = 'etherchain' }) {
  const controller = ControllerFor(network, txParams, networkFile)
  controller.checkLocalContractDeployed(contractAlias, true)
  controller.verifyAndPublishContract(contractAlias, optimizer, runs, remote)
}

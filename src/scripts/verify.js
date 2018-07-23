import ControllerFor from '../models/network/ControllerFor'
import ZosPackageFile from '../models/files/ZosPackageFile'
import ZosNetworkFile from '../models/files/ZosNetworkFile'

export default function verify(contractAlias, { network, txParams = {}, networkFile = undefined, optimizer = false, runs = undefined }) {
  const controller = ControllerFor(network, txParams, networkFile)
  controller.checkLocalContractDeployed(contractAlias, true)
  controller.verifyAndPublishContract(contractAlias)
}

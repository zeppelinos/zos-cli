import Logger from '../utils/Logger'
import AppController from '../models/AppController';
import StdlibDeployer from '../models/stdlib/StdlibDeployer';

const log = new Logger('deployAll')

export default async function deployAll({ network, txParams = {}, packageFileName = null }) {
  const appController = new AppController(packageFileName).onNetwork(network, txParams);
  
  await appController.deployStdlib();
  await appController.sync();
  appController.writeNetworkPackage();
}

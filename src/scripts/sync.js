import Logger from '../utils/Logger'
import AppController from '../models/AppController';

const log = new Logger('sync')

export default async function sync({ network, deployStdlib, txParams = {}, packageFileName = null, networkFileName = null }) {
  const appController = new AppController(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.sync();
  appController.writeNetworkPackage();
}

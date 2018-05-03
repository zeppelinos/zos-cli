import sync from './sync'
import StdlibDeployer from "../models/stdlib/StdlibDeployer";

// TODO: This file should a middle layer instead of invoking another command
// See https://github.com/zeppelinos/zos-cli/issues/1
export default async function deployAll({ network, txParams = {}, packageFileName = null }) {
  await sync({ network, txParams, packageFileName, deployStdlib: async function(appManager, stdlibName) {
    return StdlibDeployer.call(stdlibName, txParams);
  }});
}

import sync from './sync'
import StdlibDeployer from "../zos-lib/stdlib/StdlibDeployer";

// TODO: This file should a middle layer instead of invoking another command
// See https://github.com/zeppelinos/zos-cli/issues/1
async function deployAll({ network, from, packageFileName }) {
  await sync({ network, from, packageFileName, deployStdlib: async function(appManager, stdlibName) {
    return new StdlibDeployer(from).call(stdlibName);
  }});
}

module.exports = deployAll

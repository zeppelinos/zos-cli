export default function contractBuildDirectory() {
  const truffleConfig = require(`${process.cwd()}/truffle.js`)
  if (truffleConfig.contracts_build_directory) {
    return truffleConfig.contracts_build_directory
  }
  return `${process.cwd()}/build/contracts`
}

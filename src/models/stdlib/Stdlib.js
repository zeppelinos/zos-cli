import StdlibInstaller from './StdlibInstaller';
import { FileSystem as fs } from 'zos-lib'

export default class Stdlib {
  constructor(nameAndVersion) {
    this._parseNameVersion(nameAndVersion)
  }

  getName() {
    return this.name
  }

  // TODO: Provided version and package.json version may not match, raise an error if so
  getVersion() {
    if (this.version) return this.version
    return this._packageJson().version
  }

  async getContract(contractAlias) {
    const implementationName = this.jsonData.contracts[contractAlias]
    if (!implementationName) throw `Contract ${contractAlias} not found in package`
    const contractData = fs.parseJson(`node_modules/${name}/build/contracts/${implementationName}.json`)
    return ContractsProvider.getByJSONData(contractData)
  }
  
  async install() {
    await StdlibInstaller.call(this.nameAndVersion)
  }

  _packageJson() {
    if (this.packageJson) return this.packageJson
    const filename = `node_modules/${this.name}/package.zos.json`
    this.packageJson = fs.parseJson(filename)
  }

  _parseNameVersion(nameAndVersion) {
    const [name, version] = nameAndVersion.split('@')
    this.name = name
    this.version = version
    this.nameAndVersion = nameAndVersion;
  }
}

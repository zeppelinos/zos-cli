import fs from 'fs'

export default class Stdlib {
  constructor(nameAndVersion) {
    this._parseNameVersion(nameAndVersion)
  }

  getName() {
    return this.name
  }

  getVersion() {
    if(this.version) return this.version
    return this._packageJson().version
  }

  _packageJson() {
    if(this.packageJson) return this.packageJson
    const filename = `node_modules/${this.name}/package.zos.json`
    this.packageJson = JSON.parse(fs.readFileSync(filename))
  }

  _parseNameVersion(nameAndVersion) {
    const [name, version] = nameAndVersion.split('@')
    this.name = name
    this.version = version
  }
}

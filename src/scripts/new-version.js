import Stdlib from "../models/Stdlib"
import StdlibInstaller from "../zos-lib/stdlib/StdlibInstaller"
import PackageFilesInterface from '../utils/PackageFilesInterface'

async function newVersion(version, { packageFileName, stdlibNameVersion, installDeps }) {
  if (version === undefined) throw 'Must provide the new project version'
  const files = new PackageFilesInterface(packageFileName)
  const zosPackage = files.read()
  zosPackage.version = version
  zosPackage.contracts = {}
  zosPackage.stdlib = {}

  if(stdlibNameVersion) {
    const stdlib = installDeps ? StdlibInstaller.call(stdlibNameVersion) : new Stdlib(stdlibNameVersion)
    await files.setStdlib(zosPackage, stdlib)
  }

  files.write(zosPackage)
}

module.exports = newVersion

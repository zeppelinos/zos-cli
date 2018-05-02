import Stdlib from "../models/Stdlib"
import StdlibInstaller from "../zos-lib/stdlib/StdlibInstaller"
import PackageFilesInterface from '../utils/PackageFilesInterface'

async function setStdlib(stdlibNameVersion, { packageFileName, installDeps }) {
  const files = new PackageFilesInterface(packageFileName)
  const zosPackage = files.read()
  const stdlib = installDeps ? StdlibInstaller.call(stdlibNameVersion) : new Stdlib(stdlibNameVersion)
  await files.setStdlib(zosPackage, stdlib)
  files.write(zosPackage)
}

module.exports = setStdlib

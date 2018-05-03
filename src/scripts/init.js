import Stdlib from "../models/Stdlib";
import StdlibInstaller from "../zos-lib/stdlib/StdlibInstaller"
import PackageFilesInterface from '../utils/PackageFilesInterface'

const DEFAULT_VERSION = '0.1.0'
const BASE_PACKAGE = {
  version: null,
  contracts: {},
  stdlib: {}
}

export default async function init({ name, version, stdlibNameVersion = null, installDeps = false, packageFileName = null }) {
  if (name === undefined) throw 'Must provide a project name'
  const files = new PackageFilesInterface(packageFileName)
  const zosPackage = BASE_PACKAGE

  zosPackage.name = name
  zosPackage.version = version || DEFAULT_VERSION
  zosPackage.stdlib = {}

  if(stdlibNameVersion) {
    const stdlib = installDeps ? await StdlibInstaller.call(stdlibNameVersion) : new Stdlib(stdlibNameVersion)
    await files.setStdlib(zosPackage, stdlib)
  }

  files.write(zosPackage)
}

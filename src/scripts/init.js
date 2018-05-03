import Stdlib from "../models/stdlib/Stdlib";
import StdlibInstaller from "../models/stdlib/StdlibInstaller"
import PackageFilesInterface from '../utils/PackageFilesInterface'

import AppController from  '../models/AppController'

const DEFAULT_VERSION = '0.1.0'

export default async function init({ name, version, stdlibNameVersion = null, installDeps = false, packageFileName = null }) {
  if (name === undefined) throw 'Must provide a project name'
  
  const appController = new AppController(packageFileName)
  appController.init(name, version || DEFAULT_VERSION)

  // TODO: Move into appController?
  if (stdlibNameVersion) {
    const stdlib = installDeps ? await StdlibInstaller.call(stdlibNameVersion) : new Stdlib(stdlibNameVersion)
    await appController.setStdlib(stdlib)
  }

  appController.writePackage()
}

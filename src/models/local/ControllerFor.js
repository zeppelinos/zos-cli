import ZosPackageFile from '../files/ZosPackageFile'
import LocalAppController from './LocalAppController';
import LocalLibController from './LocalLibController';

export default function(packageFile = new ZosPackageFile()) {
  packageFile.ifMissingThrow(`zOS file ${packageFile.fileName} not found. Run 'zos init' first to initialize the project.`)

  return packageFile.isLib()
    ? new LocalLibController(packageFile)
    : new LocalAppController(packageFile)
}

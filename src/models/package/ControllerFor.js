import AppController from './AppController';
import LibController from './LibController';
import { FileSystem as fs } from 'zos-lib';

export default function(packageFileName) {
  if (!fs.exists(packageFileName)) {
    throw Error(`Package file ${packageFileName} not found. Run 'zos init' first to initialize the project.`);
  }
  
  const packageData = fs.parseJson(packageFileName);
  if (packageData.lib) {
    return new LibController(packageFileName);
  } else {
    return new AppController(packageFileName);
  }
}
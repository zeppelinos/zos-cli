import LibController from  '../models/package/LibController'

export default async function initLib({ name, version, packageFileName = undefined }) {
  if (name === undefined) throw Error('A project name must be provided to initialize the project.')
  
  const libController = new LibController(packageFileName)
  libController.init(name, version)  
  libController.writePackage()
}

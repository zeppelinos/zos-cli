import LocalAppController from  '../models/local/LocalAppController'
import ZosPackageFile from "../models/files/ZosPackageFile"

export default function verify(contractName, { network, optimizer = false, runs = undefined }) {
  /*
   * TODO:
   * - verify if contract has been compiled: validateImplementation
   * - verify if contract has been deployed to the blockchain (i.e., exists in zos.<network>.json)
   * - verify if latest compiled version of contract matches last deployed contract
   * - flatten the contract sourcecode and get the solidity compiler version
   * - verify the contract
   * */
  const controller = new LocalAppController(new ZosPackageFile())
}

import contract from 'truffle-contract';
import fs from 'fs';
import path from 'path';

export default class Stdlib {
  constructor(name) {
    this.name = name;
    this.package = JSON.parse(fs.readFileSync(`node_modules/${this.name}/package.zos.json`));
  }

  async getContract(contractName) {
    const implName = this.package.contracts[contractName];
    if (!implName) throw `Contract ${contractName} not found in package`;
    const schema = JSON.parse(fs.readFileSync(`node_modules/${this.name}/build/contracts/${implName}.json`));
    return contract(schema);
  }

  async listContracts() {
    return Object.keys(this.package.contracts);
  }

  deploy() {

  }
}
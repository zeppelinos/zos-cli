'use strict'
require('../setup')

import CaptureLogs from '../helpers/captureLogs';
import { Contracts, Logger } from 'zos-lib';

import add from '../../src/scripts/add.js';
import init from '../../src/scripts/init.js';
import push from '../../src/scripts/push.js';
import createProxy from '../../src/scripts/create.js';
import linkStdlib from '../../src/scripts/link.js';
import ZosPackageFile from "../../src/models/files/ZosPackageFile";

const ImplV1 = Contracts.getFromLocal('ImplV1');

contract('create script', function([_, owner]) {
  const contractName = 'ImplV1';
  const contractAlias = 'Impl';
  const anotherContractName = 'AnotherImplV1';
  const anotherContractAlias = 'AnotherImpl';
  const uninitializableContractName = 'UninitializableImplV1';
  const uninitializableContractAlias = 'UninitializableImpl';
  const contractsData = [
    { name: contractName, alias: contractAlias},
    { name: anotherContractName, alias: anotherContractAlias },
    { name: uninitializableContractName, alias: uninitializableContractAlias }
  ];

  const network = 'test';
  const appName = 'MyApp';
  const defaultVersion = '0.1.0';
  const txParams = { from: owner };

  beforeEach('setup', async function() {
    this.packageFile = new ZosPackageFile('test/tmp/.zos.json')
    this.networkFile = this.packageFile.networkFile(network)

    await init({ name: appName, version: defaultVersion, packageFile: this.packageFile });
    await add({ contractsData, packageFile: this.packageFile });
    await push({ network, txParams, networkFile: this.networkFile });
  });

  const assertProxy = async function(alias, { version, say, implementation }) {
    const proxyInfo = this.networkFile.proxy(alias)[0]
    proxyInfo.address.should.be.nonzeroAddress;
    proxyInfo.version.should.eq(version);

    if (say) {
      const proxy = await ImplV1.at(proxyInfo.address);
      const said = await proxy.say();
      said.should.eq(say);
    }

    if (implementation) {
      proxyInfo.implementation.should.eq(implementation);
    }
  }

  it.only('should create a proxy for one of its contracts', async function() {
    await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile });

    const implementation = this.networkFile.contract(contractAlias).address;
    await assertProxy(contractAlias, { version: defaultVersion, say: 'V1', implementation });
  });

  it('should refuse to create a proxy for an undefined contract', async function() {
    await createProxy({ contractAlias: 'NotExists', network, txParams, networkFile: this.networkFile }).should.be.rejectedWith(/not found/);
  });

  it('should refuse to create a proxy for a lib project', async function() {
    this.packageFile.lib = true
    await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile }).should.be.rejectedWith('Cannot create proxy for stdlib');
  });

  it('should refuse to create a proxy for an undeployed contract', async function() {
    const customContractsData = [{ name: contractName, alias: 'NotDeployed' }]
    await add({ contractsData: customContractsData, networkFile: this.networkFile });

    await createProxy({ contractAlias: 'NotDeployed', network, txParams, networkFile: this.networkFile }).should.be.rejectedWith(/not deployed/);
  });

  it('should be able to have multiple proxies for one of its contracts', async function() {
    await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile });
    await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile });
    await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile });

    this.networkFile.proxy(contractAlias).should.have.lengthOf(3);
  });

  it('should be able to handle proxies for more than one contract', async function() {
    await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile });
    await createProxy({ contractAlias: anotherContractAlias, network, txParams, networkFile: this.networkFile });

    await assertProxy(this.networkFile.proxy(contractAlias)[0], { version: defaultVersion, say: 'V1' });
    await assertProxy(this.networkFile.proxy(anotherContractAlias)[0], { version: defaultVersion, say: 'AnotherV1' });
  });

  describe('warnings', function () {
    beforeEach('capturing log output', function () {
      this.logs = new CaptureLogs();
    });

    afterEach(function () {
      this.logs.restore();
    });

    it('should warn when not initializing a contract with initialize method', async function() {
      await createProxy({ contractAlias, network, txParams, networkFile: this.networkFile });

      this.logs.errors.should.have.lengthOf(1);
      this.logs.errors[0].should.match(/make sure you initialize/i);
    });

    it('should warn when not initializing a contract that inherits from one with an initialize method', async function() {
      await createProxy({ contractAlias: anotherContractAlias, network, txParams, networkFile: this.networkFile });

      this.logs.errors.should.have.lengthOf(1);
      this.logs.errors[0].should.match(/make sure you initialize/i);
    });

    it('should not warn when initializing a contract', async function() {
      await createProxy({ contractAlias, network, txParams, initMethod: 'initialize', initArgs: [42], networkFile: this.networkFile });

      this.logs.errors.should.have.lengthOf(0);
    });

    it('should not warn when a contract has not initialize method', async function() {
      await createProxy({ contractAlias: uninitializableContractAlias, network, txParams, networkFile: this.networkFile });

      this.logs.errors.should.have.lengthOf(0);
    });
  });

  describe('with stdlib', function () {
    beforeEach('setting stdlib', async function () {
      await linkStdlib({ stdlibNameVersion: 'mock-stdlib@1.1.0', packageFile: this.packageFile });
      await push({ network, txParams, deployStdlib: true, networkFile: this.networkFile });
    });

    it('should create a proxy for a stdlib contract', async function () {
      await createProxy({ contractAlias: 'Greeter', network, txParams, networkFile: this.networkFile });

      await assertProxy('Greeter', { version: defaultVersion });
    });
  });

  describe('with local modifications', function () {
    beforeEach('changing local network file to have a different bytecode', async function () {
      const address = this.packageFile.contract(contractAlias).address
      this.packageFile.contracts = { contractAlias: { address, bytecodeHash: '0xabcd' } }
    });

    it('should refuse to create a proxy for a modified contract', async function () {
      await createProxy({ contractAlias,network, txParams, networkFile: this.networkFile }).should.be.rejectedWith(/has changed/);
    });

    it('should create a proxy for an unmodified contract', async function () {
      await createProxy({ contractAlias: anotherContractAlias, network, txParams, networkFile: this.networkFile });

      await assertProxy(anotherContractAlias, { version: defaultVersion, say: 'AnotherV1' });
    });

    it('should create a proxy for a modified contract if force is set', async function () {
      await createProxy({ contractAlias, network, txParams, force: true, networkFile: this.networkFile });

      await assertProxy(contractAlias, { version: defaultVersion, say: 'V1' });
    });
  });
});

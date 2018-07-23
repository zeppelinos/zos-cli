'use strict'
require('../setup')

import { Contracts } from 'zos-lib'

import verify from '../../src/scripts/verify.js';
import push from '../../src/scripts/push.js';
import ZosPackageFile from '../../src/models/files/ZosPackageFile'
import ZosNetworkFileFile from '../../src/models/files/ZosNetworkFile'

const ImplV1 = Contracts.getFromLocal('ImplV1');

contract('verify script', function() {
  const contractAlias = 'Impl'
  const network = 'test'
  const txParams = {}
  let packageFile;
  let networkFile;

  describe('validations', function() {
    describe('with invalid package or network files', function() {
      it('throws error if zOS project is not yet initialized', async function() {
        packageFile = new ZosPackageFile('non-existent-package.zos.json')
        networkFile = packageFile.networkFile(network)
        expect(() => verify(contractAlias, { network, networkFile })).to.throw(/Run 'zos init' first to initialize the project./)
      })

      it('throws error if contract not yet added', function() {
        packageFile = new ZosPackageFile('test/mocks/packages/package-with-contracts.zos.json')
        networkFile = packageFile.networkFile(network)
        const nonExistentContract = 'NonExistent'
        expect(() => verify(nonExistentContract, { network, networkFile })).to.throw(/not found in application/)
      })
    })

    describe('with valid package and network files', function() {
      beforeEach(function() {
        packageFile = new ZosPackageFile('test/mocks/packages/package-with-contracts.zos.json')
        networkFile = packageFile.networkFile(network)
      })

      it('throws error if contract not yet deployed', function() {
        expect(() => verify(contractAlias, { network, networkFile })).to.throw(/is not deployed to/)
      })

      it('throws error if contract source code has changed locally since last deploy', async function() {
        await push({ network, networkFile, txParams })
        const contracts = networkFile.contracts
        contracts[contractAlias].bytecodeHash = '0x0303456'
        networkFile.contracts = contracts
        expect(() => verify(contractAlias, { network, networkFile })).to.throw(/has changed locally since the last deploy/)
      })
    })
  })
})

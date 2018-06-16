'use strict'
require('../setup')

import init from '../../src/scripts/init.js'
import addAll from '../../src/scripts/add-all'
import ZosPackageFile from '../../src/models/files/ZosPackageFile'

contract('add-all script', function() {
  const appName = 'MyApp'
  const defaultVersion = '0.1.0'

  beforeEach('setup', async function() {
    this.packageFile = new ZosPackageFile('/test/tmp/.zos.json')
    await init({ name: appName, version: defaultVersion, packageFile: this.packageFile })
  })

  it('should add all contracts in build contracts dir', function() {
    addAll({ packageFile: this.packageFile })

    this.packageFile.contract('ImplV1').should.eq('ImplV1')
    this.packageFile.contract('ImplV2').should.eq('ImplV2')
  })
})

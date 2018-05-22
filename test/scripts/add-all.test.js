'use strict';

import init from '../../src/scripts/init.js'
import addAll from '../../src/scripts/add-all'
import { cleanup, cleanupfn } from '../helpers/cleanup.js';
import { FileSystem as fs } from 'zos-lib';

contract('add-all script', function() {
  const appName = 'MyApp'
  const defaultVersion = '0.1.0'
  const tmpDir = 'test/tmp';
  const packageFileName = `${tmpDir}/zos.json`;

  beforeEach('setup', async function() {
    fs.createDir(tmpDir);
    await init({ name: appName, version: defaultVersion, packageFileName })
  })

  afterEach(cleanupfn(tmpDir))

  it('should add all contracts in build contracts dir', function() {
    addAll({ packageFileName })

    const data = fs.parseJson(packageFileName)
    data.contracts.ImplV1.should.eq('ImplV1')
    data.contracts.ImplV2.should.eq('ImplV2')
  })
})

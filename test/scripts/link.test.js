'use strict'
require('../setup')

import init from '../../src/scripts/init.js';
import linkStdlib from '../../src/scripts/link.js';
import ZosPackageFile from "../../src/models/files/ZosPackageFile";

contract('link script', function() {
  const name = 'MyApp';
  const version = '0.1.0';

  beforeEach('setup', async function() {
    this.packageFile = new ZosPackageFile('test/tmp/zos.json')
    await init({ name, version, stdlibNameVersion: 'mock-stdlib@1.1.0', packageFile: this.packageFile });
  });

  it('should set stdlib', async function () {
    await linkStdlib({ stdlibNameVersion: 'mock-stdlib@1.1.0', packageFile: this.packageFile });

    this.packageFile.stdlibName.should.eq('mock-stdlib');
    this.packageFile.stdlibVersion.should.eq('1.1.0');
  });

  it('should install the stdlib if requested', async function () {
    await linkStdlib({ stdlibNameVersion: 'mock-stdlib@1.1.0', installLib: true, packageFile: this.packageFile });

    this.packageFile.stdlibName.should.eq('mock-stdlib');
    this.packageFile.stdlibVersion.should.eq('1.1.0');
  });

  it('should refuse to set a stdlib for a lib project', async function () {
    this.packageFile.lib = true

    await linkStdlib({ stdlibNameVersion: 'mock-stdlib@1.1.0', packageFile: this.packageFile })
      .should.be.rejectedWith('Libraries cannot use a stdlib');
  });

  it('should raise an error if requested version of stdlib does not match its package version', async function () {
    await linkStdlib({ stdlibNameVersion: 'mock-stdlib-invalid@1.0.0', packageFile: this.packageFile })
      .should.be.rejectedWith('Requested stdlib version 1.0.0 does not match stdlib package version 2.0.0')
  });
});

'use strict'
require('../setup')

import sinon from 'sinon';

import * as add from '../../src/scripts/add';
import * as addAll from '../../src/scripts/add-all';
import * as push from '../../src/scripts/push';
import * as runWithTruffle from '../../src/utils/runWithTruffle'
import Session from '../../src/models/network/Session'
import program from '../../src/bin/program';

contract('add command', function() {
  
  it('should call add script with an alias and a filename', function(done) {
    var addFake = sinon.fake(function () {
      expect(addFake.calledOnce).to.equal(true)
      expect(addFake.calledWithExactly({ contractsData: [ { name: 'ImplV1', alias: 'Impl' } ] })).to.equal(true)
      addStub.restore()
      done()
    })

    var addStub = sinon.stub(add, 'default').callsFake(addFake)
    program.parse(['node', 'zos', 'add', 'ImplV1:Impl', '--skip-compile'])
  });

  it('should call add-all script when passing --all option', function(done) {
    var addAllFake = sinon.fake(function () {
      expect(addAllFake.calledOnce).to.equal(true)
      expect(addAllFake.calledWithExactly( { } )).to.equal(true)
      addAllStub.restore()
      done()
    })

    var addAllStub = sinon.stub(addAll, 'default').callsFake(addAllFake)
    program.parse(['node', 'zos', 'add', '--all', '--skip-compile'])
  });

  it('should call push script when passing --push option', function(done) {
    var addAllFake = sinon.fake()
    var runWithTruffleFake = function(script, options) {
      const { network, from, timeout } = Session.getOptions(options)
      const txParams = from ? { from } : {}
    
      if (!network) throw Error('A network name must be provided to execute the requested action.')
      script({ network, txParams })
    }
    var pushFake = sinon.fake(function () {
      expect(pushFake.calledOnce).to.equal(true)
      expect(pushFake.calledWithExactly({ deployStdlib: undefined, reupload: undefined, network: 'test', txParams: {} })).to.equal(true)
      addAllStub.restore()
      pushStub.restore()
      runWithTruffleStub.restore()
      done()
    })

    var addAllStub = sinon.stub(addAll, 'default').callsFake(addAllFake)
    var pushStub = sinon.stub(push, 'default').callsFake(pushFake)
    var runWithTruffleStub = sinon.stub(runWithTruffle, 'default').callsFake(runWithTruffleFake)

    program.parse(['node', 'zos', 'add', '--all', '--push', 'test', '--skip-compile'])
  });

});

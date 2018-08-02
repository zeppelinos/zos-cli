import sinon from 'sinon';

import * as add from '../../src/scripts/add';
import * as addAll from '../../src/scripts/add-all';
import * as push from '../../src/scripts/push';
import * as runWithTruffle from '../../src/utils/runWithTruffle'
import Session from '../../src/models/network/Session'
import program from '../../src/bin/program';

exports.setup = function () {
  beforeEach('set up stubs', function () {
    this.add = sinon.stub(add, 'default')
    this.addAll = sinon.stub(addAll, 'default')
    this.push = sinon.stub(push, 'default')
    this.runWithTruffle = sinon.stub(runWithTruffle, 'default').callsFake(function (script, options) {
      const { network, from, timeout } = Session.getOptions(options)
      const txParams = from ? { from } : {}
      if (!network) throw Error('A network name must be provided to execute the requested action.')
      script({ network, txParams })
    })
  })

  afterEach('restore', function () {
    this.add.restore()
    this.addAll.restore()
    this.push.restore()
    this.runWithTruffle.restore()
  })
};

exports.itShouldParse = function (name, cmd, args, cb) {
  it(name, function (done) {
    this[cmd].onFirstCall().callsFake(() => {
      cb(this[cmd])
      done()
    })
    program.parse(args)
  })
}
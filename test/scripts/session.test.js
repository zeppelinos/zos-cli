'use strict';
require('../setup');

import session from '../../src/scripts/session';
import Session from "../../src/models/network/Session";

describe('session script', function () {

  afterEach(() => Session.close())

  describe('opening a new session', function () {
    describe('when there was no session opened before', function () {
      it('sets the new network', function () {
        session({ network: 'foo' })

        Session.getNetwork().should.be.equal('foo')
      })
    })

    describe('when there was no session opened before', function () {
      beforeEach(() => session({ network: 'foo' }))

      it('replaces the previous network', function () {
        session({ network: 'bar' })

        Session.getNetwork().should.be.equal('bar')
      })
    })
  })

  describe('closing a session', function () {
    describe('when there was no session opened before', function () {
      it('sets the new network', function () {
        session({ close: true })

        assert(Session.getNetwork() === undefined)
      })
    })

    describe('when there was no session opened before', function () {
      beforeEach(() => session({ network: 'foo' }))

      it('replaces the previous network', function () {
        session({ close: true })

        assert(Session.getNetwork() === undefined)
      })
    })
  })

  describe('when no arguments are given', function () {
    it('throws an error', function () {
      expect(() => session({})).to.throw('Please provide either --network <network> or --close.')
    })
  })

  describe('when both arguments are given', function () {
    it('throws an error', function () {
      expect(() => session({ network: 'boo', close: true })).to.throw('Please provide either --network <network> or --close.')
    })
  })
})

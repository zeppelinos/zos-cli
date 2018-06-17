'use strict';

require('../setup');

import { getNetwork, setNetwork } from '../../src/scripts/session';

describe('session', function () {
  describe('getNetwork/setNetwork', function () {
    it('setNetwork should not throw', () => setNetwork({remove : true}));

    it('getNetwork should return undefined',
      () => (getNetwork() || 'undefined').should.deep.eq('undefined'));

    it('setNetwork should not throw', () => setNetwork({ network: 'foo' }));

    it('getNetwork should return foo', () => getNetwork().should.deep.eq('foo'));

    it('setNetwork should throw', function() {
      let error = '';
      try {
        setNetwork({});
      } catch(e) {
        error = e;
      }
      error.toString().should.deep.eq(
        'Error: Please provide either --network <network> or --remove.');
    });

    it('setNetwork should throw', function() {
      let error = '';
      try {
        setNetwork({ network: 'foo', remove: true });
      } catch(e) {
        error = e;
      }
      error.toString().should.deep.eq(
        'Error: Please provide either --network <network> or --remove.');
    });

    // to remove .zos.session
    it('setNetwork should not throw', () => setNetwork({remove : true}));
  });
});

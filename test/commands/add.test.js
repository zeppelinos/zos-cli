'use strict'
require('../setup')

import {setup, itShouldParse} from './share';

contract('add command', function() {

  setup()

  itShouldParse('should call add script with an alias and a filename', 'add', ['node', 'zos', 'add', 'ImplV1:Impl', '--skip-compile'], function(fake) {
    fake.should.have.been.calledWithExactly({ contractsData: [ { name: 'ImplV1', alias: 'Impl' } ] })
  })
  
  itShouldParse('should call add-all script when passing --all option', 'addAll', ['node', 'zos', 'add', '--all', '--skip-compile'], function(fake) {
    fake.should.have.been.calledWithExactly( { } )
  })

  itShouldParse('should call push script when passing --push option', 'push', ['node', 'zos', 'add', '--all', '--push', 'test', '--skip-compile'], function(fake) {
    fake.should.have.been.calledWithExactly({ deployStdlib: undefined, reupload: undefined, network: 'test', txParams: {} })
  })

})

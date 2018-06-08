const Mocha = require('mocha-parallel-tests').default
const fs = require('fs');
const path = require('path');
const file = require('file');

const mocha = new Mocha();

file.walkSync('test', function(start, dirs, names) {
  names.forEach(function(f) {
    if (f.substr(-7) === 'test.js') {
      mocha.addFile(path.join(start, f));
    }
  });
});

mocha.run();

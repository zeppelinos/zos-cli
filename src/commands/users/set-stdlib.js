const setStdlib = require('../../scripts/set-stdlib')
const runWithTruffle = require('../../utils/runWithTruffle')

module.exports = function(program) {
  program
    .command('set-stdlib <stdlib>')
    .description("Set a standard library for your project.\n  Provide the npm package of the standard library under <stdlib>.")
    .usage('<stdlib> [options]')
    .option('-f, --from <from>', 'Set the transactions sender')
    .option('--no-install', 'Skip installing stdlib npm dependencies')
    .action(function (stdlib, options) {
      const installDeps = options.install
      runWithTruffle(() => setStdlib(stdlib, { installDeps }))
    })
}

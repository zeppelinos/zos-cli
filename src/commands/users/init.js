const init = require('../../scripts/init')

module.exports = function(program) {
  program
    .command('init <project> [version]')
    .description(`Initialize your project with zeppelin_os.
      Provide a <project> name.
      Provide a [version] number, otherwise 0.0.1 will be used by default.`)
    .option('-s, --stdlib <stdlib>', 'Standard library to use')
    .option('--no-install', 'Skip installing stdlib npm dependencies')
    .action(function (project, version, options) {
      const { stdlib, install: installDeps } = options
      init(project, version, { stdlib, installDeps })
    })
}

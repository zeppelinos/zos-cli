const init = require('../commands/users/init')
const addImplementation = require('../commands/users/add-implementation')
const sync = require('../commands/users/sync')
const createProxy = require('../commands/users/create-proxy')
const bumpVersion = require('../commands/users/bump-version')
const upgradeProxy = require('../commands/users/upgrade-proxy')
const setStdlib = require('../commands/users/set-stdlib')
const status = require('../commands/users/status')

module.exports = function registerUserCommands(program) {
  init(program)
  addImplementation(program)
  sync(program)
  createProxy(program)
  bumpVersion(program)
  upgradeProxy(program)
  setStdlib(program)
  status(program)
}

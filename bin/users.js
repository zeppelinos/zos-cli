const init = require('../src/commands/users/init')
const addImplementation = require('../src/commands/users/add-implementation')
const sync = require('../src/commands/users/sync')
const createProxy = require('../src/commands/users/create-proxy')
const newVersion = require('../src/commands/users/new-version')
const upgradeProxy = require('../src/commands/users/upgrade-proxy')
const setStdlib = require('../src/commands/users/set-stdlib')
const deployAll = require('../src/commands/users/deploy-all')

module.exports = function registerUserCommands(program) {
  init(program)
  addImplementation(program)
  sync(program)
  createProxy(program)
  newVersion(program)
  upgradeProxy(program)
  setStdlib(program)
  deployAll(program)
}

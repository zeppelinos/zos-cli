const initDistribution = require('../src/commands/developers/init-distribution')
const deploy = require('../src/commands/developers/deploy')
const register = require('../src/commands/developers/register')

module.exports = function registerDevelopersCommands(program) {
  initDistribution(program)
  deploy(program)
  register(program)
}

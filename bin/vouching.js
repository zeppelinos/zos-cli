const vouch = require('../src/commands/vouching/vouch')
const unvouch = require('../src/commands/vouching/unvouch')

module.exports = function processVouchingCommands(program) {
  vouch(program)
  unvouch(program)
}

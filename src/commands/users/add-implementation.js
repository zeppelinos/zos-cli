const addImplementation = require('../../scripts/add-implementation')

module.exports = function(program) {
  program
    .command('add-implementation <contractName> [alias]')
    .usage('<contractName> [alias]')
    .description("Register a contract implementation.\n  " +
      "Provide the name of the contract under <contractName>.\n  " +
      "Provide an [alias] to register your contract, otherwise <contractName> will be used by default")
    .action(function (contractName, alias) {
      addImplementation(contractName, alias)
    })
}

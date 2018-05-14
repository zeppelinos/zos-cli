import addImplementation from '../../scripts/add-implementation'

module.exports = function(program) {
  program
    .command('add-implementation <contractNames...>')
    .usage('<contractName1[:contractAlias1]> ... <contractNameN[:contractAliasN]>')
    .description(`Register contract implementations.
      Provide a list of <contractNames> to be registered.
      Provide an alias to register your contract using the notation <contractName:contractAlias>.
      If non alias is provided, <contractName> will be used by default.`)
    .action(function (contractNames) {
      const contractsData = contractNames.map(rawData => {
        let [ name, alias ] = rawData.split(':')
        return { name, alias: (alias || name) }
      })
      addImplementation({ contractsData })
    })
}

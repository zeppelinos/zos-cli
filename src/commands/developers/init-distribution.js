import initDistribution from '../../scripts/init-distribution'

export default function(program) {
  program
    .command('init-distribution <name> <kernel>')
    .description("Initialize your distribution project for standard libraries.\n  " +
      "Provide a distribution <name> for your project.\n  " +
      "Provide the zeppelin_os <kernel> address where your releases are going to be published.")
    .usage('<name> <kernel>')
    .action(function (name, kernelAddress) {
      initDistribution({ name, kernelAddress })
    })
}

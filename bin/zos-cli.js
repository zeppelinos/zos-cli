#! /usr/bin/env node

const program = require('commander')
const processUserCommands = require('./users')
const processVouchingCommands = require('./vouching')
const processDeveloperCommands = require('./developers')

program
  .usage('<command> [options]')
  .version(require('../package.json').version, '-v, --version')

processUserCommands(program)
processVouchingCommands(program)
processDeveloperCommands(program)
program.parse(process.argv);

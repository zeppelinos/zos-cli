import colors from 'colors'
import env from './environment'

class Logger {
  constructor(prefix) {
    this.prefix = prefix
  }

  info(msg) {
    console.log(`[${this.prefix}] ${msg}`.green)
  }

  error(msg) {
    console.error(`[${this.prefix}] ${msg}`.red)
  }
}

class SilentLogger {
  info(msg) { }
  error(msg) { }
}


module.exports = env.isTest() ? SilentLogger : Logger
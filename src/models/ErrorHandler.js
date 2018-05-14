import { Logger } from 'zos-lib'

const log = new Logger('Error')

export default class ErrorHandler {
  constructor(error, { verbose }) {
    this.error = error
    this.verbose = verbose
  }

  call() {
    const errorName = this.error.name || 'Undefined'
    const handlerName = `on${errorName}`
    this[handlerName]()
  }

  onError() {
    log.error(this.error.message)
    this._printStackIfVerbose()
    process.exit(1)
  }

  onUndefined() {
    log.error('There was an undefined error. Please execute the same command again in verbose mode if necessary.')
    this._printStackIfVerbose()
    process.exit(1)
  }

  _printStackIfVerbose() {
    if(this.verbose) console.log(this.error.stack)
  }
}

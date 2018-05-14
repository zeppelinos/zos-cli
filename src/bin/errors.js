import ErrorHandler from '../models/ErrorHandler'

module.exports = function registerErrorHandler(program) {
  process.on('unhandledRejection', reason => { throw new Error(reason); })
  process.on('uncaughtException', error => new ErrorHandler(error, program).call())
}

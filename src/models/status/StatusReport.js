export default class StatusReport {
  constructor(expected, observed, description) {
    this.expected = expected
    this.observed = observed
    this.description = description
  }

  log(logger) {
    logger.error(this.description)
    logger.error(` - on-chain: ${this.expected}`)
    logger.warn(` - local:   ${this.observed}\n`)
  }
}

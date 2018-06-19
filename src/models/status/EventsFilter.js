import { Logger } from 'zos-lib'

const log = new Logger('EventsFilter')
const TIMEOUT_ERROR = 'Promise timed out'

export default class EventsFilter {
  constructor(timeout = 2000) {
    this.timeout = timeout
  }

  async call(contract, eventName = 'allEvents') {
    let finished = false, fromBlock = 0, results = []
    while(!finished) {
      try {
        const events = await this._findFirstEventFromBlock(fromBlock, contract, eventName);
        if(events.length === 0) finished = true
        else {
          events.sort((a, b) => a.blockNumber - b.blockNumber)
          results = results.concat(events)
          fromBlock = events[events.length - 1].blockNumber + 1
        }
      } catch(error) {
        finished = true
        if(error.message !== TIMEOUT_ERROR) log.error(error)
      }
    }
    return results
  }

  async _findFirstEventFromBlock(fromBlock, contract, eventName) {
    const promise = new Promise((resolve, reject) => {
      const event = contract[eventName]({}, { fromBlock, toBlock: 'latest' });
      event.watch()
      event.get((error, result) => error ? reject(error) : resolve(result))
      event.stopWatching()
    })
    return this._promiseTimeout(promise)
  }

  async _promiseTimeout(promise) {
    const timeout = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        reject(TIMEOUT_ERROR)
      }, this.timeout)
    })
    return Promise.race([promise, timeout])
  }
}
import { FileSystem as fs, Logger } from 'zos-lib'
import _ from 'lodash'

const log = new Logger('Session')
const TIMEOUT_15_MIN_IN_SECONDS = 15 * 60
const ZOS_SESSION_PATH = '.zos.session'

const Session = {

  getSession() {
    const session = fs.parseJsonIfExists(ZOS_SESSION_PATH) || {}
    const expires = new Date(session.expires)
    if (!session || expires <= new Date()) return undefined
    log.info(`Using session with ${describe(session)}`)
    return _.pick(session, 'network', 'timeout', 'from')
  },

  getOptions(overrides) {
    return {
      ... this.getSession(),
      ... overrides
    }
  },

  open({ network, from, timeout }, expires = TIMEOUT_15_MIN_IN_SECONDS) {
    const expirationTimestamp = new Date(new Date().getTime() + expires * 1000)
    fs.writeJson(ZOS_SESSION_PATH, { network, from, timeout, expires: expirationTimestamp })
    log.info(`Using ${describe({ network, from, timeout })} by default.`)
  },

  close() {
    if (fs.exists(ZOS_SESSION_PATH)) fs.remove(ZOS_SESSION_PATH)
    log.info(`Closed zos session.`)
  },

  ignoreFile() {
    const GIT_IGNORE = '.gitignore'
    if (fs.exists(GIT_IGNORE) && fs.read(GIT_IGNORE).toString().indexOf(ZOS_SESSION_PATH) < 0) {
      fs.append(GIT_IGNORE, `\n${ZOS_SESSION_PATH}\n`)
    }
  }
}

function describe(session) {
  return _.compact([
    session.network && `network ${session.network}`,
    session.from && `sender address ${session.from}`,
    session.timeout && `timeout ${session.timeout} seconds`
  ]).join(', ') || 'no options'
}

export default Session

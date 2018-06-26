import nfs from 'fs'
import { FileSystem as fs, Logger } from 'zos-lib'

const log = new Logger('Session')
const ZOS_SESSION_PATH = '.zos.session'

const Session = {

  getNetwork() {
    return fs.exists(ZOS_SESSION_PATH) ? fs.read(ZOS_SESSION_PATH).toString() : undefined
  },

  open(network) {
    fs.write(ZOS_SESSION_PATH, network)
    log.info(`Using '${network}' as default network unless overriden.`)
  },

  close() {
    //TODO: use new version of zos-lib fs
    if (fs.exists(ZOS_SESSION_PATH)) nfs.unlinkSync(ZOS_SESSION_PATH)
    log.info(`Removed ${ZOS_SESSION_PATH}.`)
  }

}

export default Session

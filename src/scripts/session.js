'use strict';

import { FileSystem as fs } from 'zos-lib';
import { Logger } from 'zos-lib';

const ZOS_SESSION_PATH = '.zos.session';

export function getNetwork() {
  var networkName = undefined;
  try {
    networkName = fs.read(ZOS_SESSION_PATH).toString();
  } catch(e) {
  }

  return networkName;
}

export function setNetwork({ network = undefined, remove = false }) {
  if ((!network && !remove) || (network && remove)) {
    throw Error('Please provide either --network <network> or --remove.')
  }

  let log = new Logger('scripts/session');
  if (remove) {
    // no unlink in FileSystem?
    fs.write(ZOS_SESSION_PATH, '');
    log.info(`Cleared ${ZOS_SESSION_PATH}.`);
    return;
  }

  fs.write(ZOS_SESSION_PATH, network);
  log.info(`Using "${network}" as default network unless overriden.`);
}


import querystring from 'querystring'
import axios from 'axios'
import cheerio from 'cheerio'

const Verifier = {
  verifyAndPublish(remote, params) {
    if (remote === 'etherchain') {
      publishToEtherchain(params)
    }
  }
}

async function publishToEtherchain({ contractName, compiler, optimizer, runs, contractSource, contractAddress }) {
  return;
}

export default Verifier

import fs from 'fs'

export default {
  from(name, network) {
    if (!network) throw "Must specify network to read stdlib deployment address"
    const filename = `node_modules/${name}/package.zos.${network}.json`
    const networkInfo = JSON.parse(fs.readFileSync(filename))
    return networkInfo.provider.address
  }
}

import env from "../../utils/environment";
import Stdlib from "../../models/Stdlib";

export default class StdlibInstaller {
  constructor(stdlibNameAndVersion) {
    this.stdlibNameAndVersion = stdlibNameAndVersion
  }

  async call() {
    await this.installDepIfTestEnv()
    return new Stdlib(this.stdlibNameAndVersion)
  }

  async installDepIfTestEnv() {
    if(env.isNotTest()) {
      const params = { save: true, cwd: process.cwd() }
      await npm.install([this.stdlibNameAndVersion], params)
    }
  }
}

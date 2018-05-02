import env from "../../utils/environment";
import Stdlib from "../../models/Stdlib";

export default {
  async call(stdlibNameAndVersion) {
    await this._installDepIfNotTestEnv(stdlibNameAndVersion)
    return new Stdlib(stdlibNameAndVersion)
  },

  async _installDepIfNotTestEnv(stdlibNameAndVersion) {
    if(env.isNotTest()) {
      const params = { save: true, cwd: process.cwd() }
      await npm.install([stdlibNameAndVersion], params)
    }
  }
}

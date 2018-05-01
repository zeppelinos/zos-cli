const Environment = {
  ifTest(ifTrue, ifFalse = () => {}) {
    if(this.isTest()) ifTrue()
    else ifFalse()
  },

  isNotTest() {
    return !this.isTest()
  },

  isTest() {
    return process.env.NODE_ENV === 'test'
  },
}

export default Environment

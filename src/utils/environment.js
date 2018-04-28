const Environment = {
  ifTest(ifTrue, ifFalse = () => {}) {
    if(this.isTest()) ifTrue()
    else ifFalse()
  },

  isTest() {
    return process.env.NODE_ENV === 'test'
  },
}

export default Environment

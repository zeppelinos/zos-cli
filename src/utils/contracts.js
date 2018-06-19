import crypto from 'crypto'

export function extractBodyCode(rawBytecode) {
  return splitCode(rawBytecode).body
}

export function extractConstructorCode(rawBytecode) {
  return splitCode(rawBytecode).constructor
}

export function splitCode(rawBytecode) {
  const bytecode = rawBytecode.replace(/^0x/, '')
  const constructorEndingOpcodes = '6000396000f300'
  const endingConstructorIndex = bytecode.indexOf(constructorEndingOpcodes) + constructorEndingOpcodes.length
  const body = bytecode.substr(endingConstructorIndex, bytecode.length)
  const constructor = bytecode.substr(0, endingConstructorIndex)
  return { constructor, body }
}

export function bytecodeDigest(rawBytecode) {
  const bytecode = rawBytecode.replace(/^0x/, '')
  const buffer = Buffer.from(bytecode, 'hex')
  const hash = crypto.createHash('sha256')
  return hash.update(buffer).digest('hex')
}

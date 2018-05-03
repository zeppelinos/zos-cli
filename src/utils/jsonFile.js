import fs from 'fs';

export function readFrom(fileName) {
  const data = fs.readFileSync(fileName)
  return JSON.parse(data)
}

export function writeTo(fileName, obj) {
  const data = JSON.stringify(obj, null, 2)
  fs.writeFileSync(fileName, data)
}

export function exists(fileName) {
  return fs.existsSync(fileName)
}

export function tryReadFrom(fileName) {
  return exists(fileName) ? readFrom(fileName) : null;
}
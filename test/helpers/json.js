import { FileSystem as fs } from 'zos-lib';

// TODO: Use new version of FileSystem including this function
export function editJson(file, cb) {
  const data = fs.parseJson(file);
  cb(data);
  fs.writeJson(file, data);
}
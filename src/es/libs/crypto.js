import { Buffer } from "buffer";

export function randomBytes(size) {
  const result = new Buffer(size);
  globalThis.crypto.getRandomValues(result);
  return result;
}

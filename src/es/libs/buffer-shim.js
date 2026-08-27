import * as bufferModule from './buffer.js'
globalThis.Buffer = bufferModule.default.Buffer
export const Buffer = globalThis.Buffer
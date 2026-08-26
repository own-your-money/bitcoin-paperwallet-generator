export class Buffer extends Uint8Array {
  static from(value, encoding) {
    // Buffer.from("deadbeef", "hex")
    if (typeof value === "string") {
      if (encoding !== "hex") {
        throw new TypeError(`Unsupported encoding: ${encoding}`);
      }

      if (value.length % 2 !== 0) {
        throw new TypeError("Invalid hex string");
      }

      const result = new Buffer(value.length / 2);

      for (let i = 0; i < result.length; i++) {
        const byte = Number.parseInt(
          value.slice(i * 2, i * 2 + 2),
          16
        );

        if (Number.isNaN(byte)) {
          throw new TypeError("Invalid hex string");
        }

        result[i] = byte;
      }

      return result;
    }

    // Buffer.from(Uint8Array)
    if (value instanceof Uint8Array) {
      return new Buffer(value);
    }

    // Buffer.from(Array)
    if (Array.isArray(value)) {
      return new Buffer(value);
    }

    // Buffer.from(ArrayBuffer)
    if (value instanceof ArrayBuffer) {
      return new Buffer(value);
    }

    // Generic array-like object
    if (value && typeof value.length === "number") {
      return new Buffer(value);
    }

    throw new TypeError("Unsupported value");
  }

  equals(other) {
    if (!(other instanceof Uint8Array)) {
      return false;
    }

    if (this.length !== other.length) {
      return false;
    }

    for (let i = 0; i < this.length; i++) {
      if (this[i] !== other[i]) {
        return false;
      }
    }

    return true;
  }

  readInt32BE(offset = 0) {
    return (
      (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3]
    );
  }
}

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var math = require('./math-08e068f9.cjs');
var buffer = require('./buffer-a74f7330.cjs');
require('./string-b2827a90.cjs');
require('./array-78849c95.cjs');
require('./set-5b47859e.cjs');
require('./environment-2de08e0e.cjs');
require('./map-0dabcc55.cjs');
require('./conditions-f5c0c102.cjs');
require('./storage.cjs');
require('./function-09b8292c.cjs');
require('./object-491858d1.cjs');
require('./traits.cjs');
require('./encoding-1acb59c4.cjs');
require('./number-466d8922.cjs');
require('./binary-ac8e39e2.cjs');
require('./decoding-2b136346.cjs');
require('./error-8582d695.cjs');

/**
 * It is not recommended to use this package. This is the uncached implementation of the rabin
 * fingerprint algorithm. However, it can be used to verify the `rabin.js` implementation.
 *
 * @module rabin-uncached
 */

class RabinUncachedEncoder {
  /**
   * @param {Uint8Array} m assert(m[0] === 1)
   */
  constructor (m) {
    this.m = m;
    this.blen = m.byteLength;
    this.bs = new Uint8Array(this.blen);
    /**
     * This describes the position of the most significant byte (starts with 0 and increases with
     * shift)
     */
    this.bpos = 0;
  }

  /**
   * Add/Xor/Substract bytes.
   *
   * Discards bytes that are out of range.
   * @todo put this in function or inline
   *
   * @param {Uint8Array} cs
   */
  add (cs) {
    const copyLen = math.min(this.blen, cs.byteLength);
    // copy from right to left until max is reached
    for (let i = 0; i < copyLen; i++) {
      this.bs[(this.bpos + this.blen - i - 1) % this.blen] ^= cs[cs.byteLength - i - 1];
    }
  }

  /**
   * @param {number} byte
   */
  write (byte) {
    // [0,m1,m2,b]
    //  x            <- bpos
    // Shift one byte to the left, add b
    this.bs[this.bpos] = byte;
    this.bpos = (this.bpos + 1) % this.blen;
    // mod
    for (let i = 7; i >= 0; i--) {
      if (((this.bs[this.bpos] >>> i) & 1) === 1) {
        this.add(buffer.shiftNBitsLeft(this.m, i));
      }
    }
    // if (this.bs[this.bpos] !== 0) { error.unexpectedCase() }
    // assert(this.bs[this.bpos] === 0)
  }

  getFingerprint () {
    const result = new Uint8Array(this.blen - 1);
    for (let i = 0; i < result.byteLength; i++) {
      result[i] = this.bs[(this.bpos + i + 1) % this.blen];
    }
    return result
  }
}

exports.RabinUncachedEncoder = RabinUncachedEncoder;
//# sourceMappingURL=rabin-uncached.cjs.map

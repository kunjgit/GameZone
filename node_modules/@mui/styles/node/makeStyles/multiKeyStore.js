"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// Used https://github.com/thinkloop/multi-key-cache as inspiration

const multiKeyStore = {
  set: (cache, key1, key2, value) => {
    let subCache = cache.get(key1);
    if (!subCache) {
      subCache = new Map();
      cache.set(key1, subCache);
    }
    subCache.set(key2, value);
  },
  get: (cache, key1, key2) => {
    const subCache = cache.get(key1);
    return subCache ? subCache.get(key2) : undefined;
  },
  delete: (cache, key1, key2) => {
    const subCache = cache.get(key1);
    subCache.delete(key2);
  }
};
var _default = multiKeyStore;
exports.default = _default;
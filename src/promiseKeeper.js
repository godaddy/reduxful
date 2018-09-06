/**
 * Keeps track of unfulfilled promises.
 *
 * Implements part of the Map API.
 *
 * Usage:
 * Hand off a Promise with a key to a PromiseKeeper instance.
 *
 * ```js
 * const keeper = new PromiseKeeper();
 * keeper.set('myKey', aPromise)
 * ```
 *
 * The keeper will hold onto the promise until it is fulfilled.
 *
 * ```js
 * keeper.has('myKey') # true
 *
 * # after aPromise resolves or rejects
 *
 * keeper.has('myKey') # false
 * ```
 */
export default class PromiseKeeper {

  constructor() {
    this._map = new Map();
  }

  get(key) {
    if (this._map.has(key)) {
      return this._map.get(key);
    }
  }

  set(key, promise) {
    const remove = () => this._map.delete(key);
    promise.then(remove, remove);
    this._map.set(key, promise);
  }

  has(key) {
    return this._map.has(key);
  }

  clear() {
    return this._map.clear();
  }

  delete(key) {
    return this._map.delete(key);
  }

  get size() {
    return this._map.size;
  }
}

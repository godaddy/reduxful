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
    _map: any;
    get(key: any): any;
    set(key: any, promise: any): void;
    has(key: any): any;
    clear(): any;
    delete(key: any): any;
    get size(): any;
}

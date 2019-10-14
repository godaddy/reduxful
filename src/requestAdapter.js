import { RequestAdapterError } from './errors';

global.Reduxful = global.Reduxful || {};

/**
 * RequestAdapter structure
 *
 * @typedef {Function} RequestAdapter
 * @param {RequestAdapterOptions} options
 * @returns {Promise}
 */

/**
 * RequestAdapter Options
 *
 * @typedef {object} RequestAdapterOptions
 * @property {object} options
 * @property {string} options.method - HTTP method to use (GET, POST, etc.)
 * @property {string} options.url - URL to call
 * @property {Object.<string,string>} options.headers - Header for request
 * @property {boolean} options.withCredentials - Should cookies be passed for cross-origin requests
 * @property {*} options.body - Optional body of request
 */

/**
 * Get the registered request adapter.
 *
 * @returns {RequestAdapter} requestAdapter
 * @private
 */
export function getRequestAdapter() {
  if (!global.Reduxful.requestAdapter) {
    throw new RequestAdapterError('No Request Adapter has been set.');
  }
  return global.Reduxful.requestAdapter;
}

/**
 * Register an ajax request adapter.
 *
 * @param {RequestAdapter} requestAdapter - Request adapter to use
 * @public
 */
export function setRequestAdapter(requestAdapter) {
  if (!global.Reduxful.requestAdapter) {
    global.Reduxful.requestAdapter = requestAdapter;
    return;
  }
  throw new RequestAdapterError('Request Adapter already set.');
}

/**
 * Makes a request using the request adapter defined by api config the global default.
 *
 * @param {string} method - Request HTTP Method
 * @param {string} url - Transformed URL of the rest endpoint
 * @param {object} [options] - Additional request options
 * @param {ApiConfig} [config] - Api configuration
 * @returns {Promise} promise
 * @private
 */
export function makeRequest(method, url, options = {}, config = {}) {
  let { requestAdapter } = config;
  if (!requestAdapter) {
    requestAdapter = getRequestAdapter();
  }

  const requestOptions = {
    method,
    url,
    ...options
  };

  return requestAdapter(requestOptions);
}

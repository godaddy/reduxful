export const handlers = {};

/**
 * Reject promise if Fetch response is not `ok`
 *
 * @param {Response} response - Fetch response
 * @param {Boolean} response.ok - Did response have a bad status
 * @param {JSON|string} data - Decoded response body
 * @returns {Promise} promise
 */
handlers.finish = function (response, data) {
  return response.ok ? Promise.resolve(data) : Promise.reject(data);
};

/**
 * Decode fetch response content in order to store to redux state then pass to finish handler
 *
 * @param {Response} response - Fetch response
 * @returns {Promise} promise
 */
handlers.decode = function (response) {
  // No content, ignore response and return success
  if (response.status === 204) {
    return handlers.finish(response, null);
  }
  
  const contentType = response.headers.get('content-type');

  if (contentType.includes('application/json')) {
    return response.json()
      .then(data => handlers.finish(response, data));
  }
  try {
    return response.text()
      .then(data => handlers.finish(response, data));
  } catch (err) {
    return Promise.reject(`Content-type ${contentType} not supported`);
  }
};

/**
 * Make an adapter to match the RequestAdapter interface using Fetch
 *
 * @param {Function} fetcher - Fetch API or ponyfill
 * @param {Object} [defaultOptions] - Any default request options
 * @returns {Function} fetchAdapter
 */
export function makeFetchAdapter(fetcher, defaultOptions = {}) {
  /**
   * The RequestAdapter using Fetch
   *
   * @param {RequestAdapterOptions} options - Options from the request call
   * @returns {Promise} promise
   * @private
   */
  function fetchAdapter(options) {
    const { url, withCredentials, ...rest } = options;
    const outOpts = { ...defaultOptions, ...rest };
    outOpts.credentials = withCredentials ? 'include' : outOpts.credentials || 'same-origin';
    return fetcher(url, outOpts).then(handlers.decode);
  }

  return fetchAdapter;
}

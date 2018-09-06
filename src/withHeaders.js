/**
 * Decorate a request or fetch function to use headers when called.
 *
 * @param {Function} caller - A request or fetch function
 * @param {Object|function} headers - Header object to use or a function which returns and object
 * @returns {Function} wrappedCaller
 */
export function withHeaders(caller, headers) {
  return function wrapped(url, options) {
    const baseHeaders = typeof headers === 'function' ? headers() : headers;

    // do arguments look fetch-like
    if (typeof url === 'string' && (!options || typeof options === 'object')) {
      const { headers: argHeaders = {}, ...rest } = options || {};
      const outHeaders = { ...baseHeaders, ...argHeaders };
      return caller(url, { headers: outHeaders, ...rest });
    }

    // do arguments look request-like
    if (typeof url === 'object') {
      const { headers: argHeaders = {}, ...rest } = url;
      const outHeaders = { ...baseHeaders, ...argHeaders };
      return caller({ headers: outHeaders, ...rest });
    }

    throw new Error('Unexpected arguments passed to withHeaders wrapped caller');
  };
}

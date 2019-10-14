/**
 * Check if object is a function.
 *
 * @param {*} maybeFn - Potential function
 * @returns {boolean} result
 * @private
 */
export function isFunction(maybeFn) {
  return typeof maybeFn === 'function';
}

/**
 * Builds the resource key based on the parameters passed.
 *
 * @param {string} reqName - Name of the API request.
 * @param {Object.<string, string|number>} params - Parameters used as URL or Query params
 * @returns {string} resource key
 */
export function getResourceKey(reqName, params) {
  if (!params) return reqName;

  return Object.keys(params).sort().reduce((acc, cur) => {
    acc += `__${cur}:${params[cur]}`;
    return acc;
  }, reqName);
}

/**
 * Helper function to check if a Resource has been loaded.
 *
 * @param {Resource} resource - Resource object
 * @returns {boolean} result
 */
export function isLoaded(resource) {
  return !!resource && resource.isLoaded;
}

/**
 * Helper function to check of a Resource is being updated.
 *
 * @param {Resource} resource - Resource object
 * @returns {boolean} result
 */
export function isUpdating(resource) {
  return !!resource && resource.isUpdating;
}

/**
 * Helper function to check if a Resource has an error.
 *
 * @param {Resource} resource - Resource object
 * @returns {boolean} result
 */
export function hasError(resource) {
  return !!resource && resource.hasError;
}

/**
 * Inspect and align Request Description object.
 *
 * @param {RequestDescription} reqDesc - Request Description object
 * @returns {RequestDescription} reqDesc
 * @private
 */
export function parseReqDesc(reqDesc) {
  reqDesc.method = (reqDesc.method || 'GET').toUpperCase();

  if (reqDesc.hasOwnProperty('withCredentials')) {
    // eslint-disable-next-line no-console
    console.warn('`withCredentials` on RequestDescription is being deprecated. Set in `options` instead.');
    if (!isFunction(reqDesc.options)) {
      reqDesc.options = { withCredentials: reqDesc.withCredentials, ...reqDesc.options || {}};
    }
  }

  return reqDesc;
}

/**
 * Inspect and align API Description object.
 *
 * @param {ApiDescription} apiDesc - Api Description object
 * @returns {ApiDescription} apiDesc
 * @private
 */
export function parseApiDesc(apiDesc) {
  return Object.keys(apiDesc).reduce((acc, name) => {
    const reqDesc = apiDesc[name];
    acc[name] = parseReqDesc(reqDesc);
    return acc;
  }, {});
}

/**
 * Get the url template from static string or dynamically with redux state.
 *
 * @param {string|Function} url - Url template
 * @param {Function} getState - Get Redux state
 * @returns {string} url
 * @private
 */
export function getUrlTemplate(url, getState) {
  if (isFunction(url)) return url(getState);
  return url;
}

/**
 * Determines whether a string begins with the characters of a specified string
 *
 * @param {string} str - string to check
 * @param {string} search - string to search for at the start
 * @returns {boolean} result
 * @private
 */
export function startsWith(str, search) {
  return str.indexOf(search) === 0;
}

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {string} str - string to check
 * @param {string} search - string to search for at the end
 * @returns {boolean} result
 * @private
 */
export function endsWith(str, search) {
  return str.lastIndexOf(search) === (str.length - search.length);
}

/* eslint-disable max-statements */

const parse = require('url').parse;
import { MissingParamError } from './errors';

/**
 * Check if object is a function.
 *
 * @param {*} maybeFn - Potential function
 * @returns {Boolean} result
 * @private
 */
export function isFunction(maybeFn) {
  return typeof maybeFn === 'function';
}

/**
 * Generate the uri encoded query string.
 *
 * @param {Object.<String, String|Number>} params - Parameters used to use for query params
 * @returns {String} query string
 * @private
 */
export function buildQueryStr(params) {

  let result = '';
  const keys = Object.keys(params);
  const queryParams = [];

  if (keys.length > 0) {
    keys.forEach((k) => {
      const paramValues = Array.isArray(params[k]) ? params[k] : [params[k]];
      paramValues.forEach(v => queryParams.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`));
    });

    result = queryParams.join('&');
  }
  return result;
}

/**
 * Transform url templates with provided params.
 * To use url parameters, prefix them `:`, for example `/shopper/:shopperId`.
 * Params that have not been parameterized in the url template will be append as query params.
 * Urls with a port number will be respected, for example `http://example.com:8080`
 *
 * @param {String} urlTemplate - The base url which
 * @param {Object.<String, String|Number>} params - Parameters used as URL or query params
 * @param {String} [params.apiProtocol] - The optional protocol override
 * @param {String} [params.apiHost] - The optional api hostname override
 * @param {String} [params.apiPort] - The optional api port override
 * @returns {String} transformed url
 */
export function transformUrl(urlTemplate, params = {}) {
  const parsed = parse(urlTemplate, true);
  const { apiHostname = parsed.hostname || '', apiPort = parsed.port || '', apiProtocol = parsed.protocol || '' } = params;
  const pathAndQueryParams = Object.assign({}, params);
  delete pathAndQueryParams.apiHostname;
  delete pathAndQueryParams.apiPort;
  delete pathAndQueryParams.apiProtocol;

  let pathname = parsed.pathname;
  const slashes = parsed.slashes ? '//' : '';

  /*
     * check if the protocal already ends with a ':' or
     * if no protocol was provided (this is the case if the url is relative)
     */
  const protocolSeperator = !apiProtocol || /.*:$/.test(apiProtocol) ? '' : ':';
  const portSeperator = apiPort ? ':' : '';

  const queryParams = Object.assign({}, parsed.query, pathAndQueryParams);
  const pathParams = pathname.match(/:[\w]+/g); // Path parameters that have been identified as placeholders

  if (pathParams !== null) {
    pathParams
      .map((k) => k.substr(1))
      .forEach((k) => {
        if (pathAndQueryParams.hasOwnProperty(k)) {
          pathname = pathname.replace(`:${k}`, pathAndQueryParams[k]);
          delete queryParams[k]; // remove this from the queryparams as we just substituted a path param
        } else {
          throw new MissingParamError(`Param (${k}) not provided for url: ${urlTemplate}`);
        }
      });
  }

  const queryStr = Object.keys(queryParams).length > 0
    ? `?${buildQueryStr(queryParams)}`
    : '';

  return `${apiProtocol}${protocolSeperator}${slashes}${apiHostname}${portSeperator}${apiPort}${pathname}${queryStr}`;
}

/**
 * Builds the resource key based on the parameters passed.
 *
 * @param {String} reqName - Name of the API request.
 * @param {Object.<String, String|Number>} params - Parameters used as URL or Query params
 * @returns {String} resource key
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
 * @returns {Boolean} result
 */
export function isLoaded(resource) {
  return !!resource && resource.isLoaded;
}

/**
 * Helper function to check of a Resource is being updated.
 *
 * @param {Resource} resource - Resource object
 * @returns {Boolean} result
 */
export function isUpdating(resource) {
  return !!resource && resource.isUpdating;
}

/**
 * Helper function to check if a Resource has an error.
 *
 * @param {Resource} resource - Resource object
 * @returns {Boolean} result
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
  reqDesc.method = (reqDesc.method || 'get').toLowerCase();

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
 * @param {String|Function} url - Url template
 * @param {Function} getState - Get Redux state
 * @returns {String} url
 * @private
 */
export function getUrlTemplate(url, getState) {
  if (isFunction(url)) return url(getState);
  return url;
}

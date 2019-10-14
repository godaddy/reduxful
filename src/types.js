/**
 * Resource object
 *
 * @typedef {object} Resource
 *
 * @property {object|Array|*} value - Body of the api response
 * @property {object|Array|*} error - Body of the api error response
 * @property {boolean} hasError - True if api response returned as an error
 * @property {boolean} isLoaded - True if api response returned as success
 * @property {boolean} isUpdating - True if a request is pending
 * @property {number|null} requestTime - Timestamp when new request started
 * @property {number|null} responseTime - Timestamp when response received
 */


/**
 * Request Description object
 *
 * @typedef {object} RequestDescription
 *
 * @property {string|UrlTemplateFn} url - URL template of the REST endpoint.
 * Placeholders can be set, with final URL built by [transform-url](https://github.com/godaddy/transform-url#readme).
 * @property {string} [method] - HTTP method to use
 * @property {string} [resourceAlias] - Resource name alias
 * @property {object|Array|*} [resourceData] - Optional initial resource data
 * @property {TransformFn} [dataTransform] - Function to fixup request response
 * @property {TransformFn} [errorTransform] - Function to fixup request error response
 * @property {number} [repeatRequestDelay] - Required delay time in milliseconds between repeated requests
 * @property {object|OptionsFn} [options] - Options to be passed to the request adapter
 */


/**
 * Api Description object
 *
 * @typedef {object} ApiDescription
 *
 * @type {Object.<string, RequestDescription>} - requestName: reqDesc
 */


/**
 * Api Config object
 *
 * @typedef {object} ApiConfig
 *
 * @property {RequestAdapter} [requestAdapter] - Adapter for request library
 * @property {object|OptionsFn} [options] - Options to be passed to the request adapter
 */


/**
 * [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) compliant action.
 *
 * @typedef {object} Action
 *
 * @property {string} type - The type of action in the format `<ApiName>_<requestName>_<result>`
 * @property {string} payload - Transformed resource value or error; body of response.
 * @property {object} meta - Action metadata
 * @property {string} meta.key - Key of the particular resource
 * @property {boolean} [error] - Whether the action is an error
 */


/**
 * Function to create request options object which can read from Redux state
 *
 * @typedef {Function} OptionsFn
 *
 * @param {Function} getState - Gets the current redux state
 * @returns {object} options
 */


/**
 * Function to create url template string which can read from Redux state.
 * Placeholders can be set, with final URL built by [transform-url](https://github.com/godaddy/transform-url#readme).
 *
 * @typedef {Function} UrlTemplateFn
 *
 * @param {Function} getState - Gets the current redux state
 * @returns {string} urlTemplate
 */


/**
 * Sub action creator function
 *
 * @typedef {Function} SubActionCreatorFn
 *
 * @param {object} params - Params applied to the url path or query
 * @param {object} payload - Transformed resource value or error; body of response.
 * @returns {object} action
 */


/**
 * Selector function to retrieve a resource from Redux state
 *
 * @typedef {Function} SelectorFn
 *
 * @param {object} state - Redux state to select resource from
 * @param {object} params - Params used to key a particular resource request
 * @returns {Resource} resource
 */


/**
 * Redux Reducer function
 *
 * @typedef {Function} ReducerFn
 *
 * @param {object} state - State
 * @param {object} action - Action
 * @returns {object} newState
 */


/**
 * Transform function
 *
 * @typedef {Function} TransformFn
 *
 * @param {object|Array|*} data - Body of the api response
 * @param {object} [context] - Context
 * @param {object} [context.params] - Params from action for request
 * @returns {*} data
 */

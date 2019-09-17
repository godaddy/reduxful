/**
 * Resource object
 *
 * @typedef {Object} Resource
 *
 * @property {Object|Array|*} value - Body of the api response
 * @property {Object|Array|*} error - Body of the api error response
 * @property {Boolean} hasError - True if api response returned as an error
 * @property {Boolean} isLoaded - True if api response returned as success
 * @property {Boolean} isUpdating - True if a request is pending
 * @property {Number|null} requestTime - Timestamp when new request started
 * @property {Number|null} responseTime - Timestamp when response received
 */


/**
 * Request Description object
 *
 * @typedef {Object} RequestDescription
 *
 * @property {String|UrlTemplateFn} url - URL template of the REST endpoint.
 * Placeholders can be set, with final URL built by [transform-url](https://github.com/godaddy/transform-url#readme).
 * @property {String} [method] - HTTP method to use
 * @property {String} [resourceAlias] - Resource name alias
 * @property {Object|Array|*} [resourceData] - Optional initial resource data
 * @property {TransformFn} [dataTransform] - Function to fixup request response
 * @property {TransformFn} [errorTransform] - Function to fixup request error response
 * @property {Number} [repeatRequestDelay] - Required delay time in milliseconds between repeated requests
 * @property {Object|OptionsFn} [options] - Options to be passed to the request adapter
 */


/**
 * Api Description object
 *
 * @typedef {Object} ApiDescription
 *
 * @type {Object.<String, RequestDescription>} - requestName: reqDesc
 */


/**
 * Api Config object
 *
 * @typedef {Object} ApiConfig
 *
 * @property {RequestAdapter} [requestAdapter] - Adapter for request library
 * @property {Object|OptionsFn} [options] - Options to be passed to the request adapter
 */


/**
 * [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) compliant action.
 *
 * @typedef {Object} Action
 *
 * @property {String} type - The type of action in the format `<ApiName>_<requestName>_<result>`
 * @property {String} payload - Transformed resource value or error; body of response.
 * @property {Object} meta - Action metadata
 * @property {String} meta.key - Key of the particular resource
 * @property {Boolean} [error] - Whether the action is an error
 */


/**
 * Function to create request options object which can read from Redux state
 *
 * @typedef {Function} OptionsFn
 *
 * @param {Function} getState - Gets the current redux state
 * @returns {Object} options
 */


/**
 * Function to create url template string which can read from Redux state.
 * Placeholders can be set, with final URL built by [transform-url](https://github.com/godaddy/transform-url#readme).
 *
 * @typedef {Function} UrlTemplateFn
 *
 * @param {Function} getState - Gets the current redux state
 * @returns {String} urlTemplate
 */


/**
 * Sub action creator function
 *
 * @typedef {Function} SubActionCreatorFn
 *
 * @param {Object} params - Params applied to the url path or query
 * @param {Object} payload - Transformed resource value or error; body of response.
 * @returns {Object} action
 */


/**
 * Selector function to retrieve a resource from Redux state
 *
 * @typedef {Function} SelectorFn
 *
 * @param {Object} state - Redux state to select resource from
 * @param {Object} params - Params used to key a particular resource request
 * @returns {Resource} resource
 */


/**
 * Redux Reducer function
 *
 * @typedef {Function} ReducerFn
 *
 * @param {Object} state - State
 * @param {Object} action - Action
 * @returns {Object} newState
 */


/**
 * Transform function
 *
 * @typedef {Function} TransformFn
 *
 * @param {Object|Array|*} data - Body of the api response
 * @param {Object} [context] - Context
 * @param {Object} [context.params] - Params from action for request
 * @returns {*} data
 */

import { getResourceKey, getUrlTemplate, isFunction } from './utils';
import transformUrl from 'transform-url';
import { makeRequest } from './requestAdapter';
import * as constants from './constants';
import PromiseKeeper from './promiseKeeper';

const defaultTransformer = f => f;
const _promiseKeepers = new WeakMap();

/**
 * Weakly map a promiseKeeper to Redux store to ensure debounced fetches are
 * unique to store instance.
 *
 * @param {function} dispatch - Dispatch from Redux store
 * @returns {PromiseKeeper} promiseKeeper - Instance for provided dispatch
 * @private
 */
export function getPromiseKeeper(dispatch) {
  if (!_promiseKeepers.has(dispatch)) {
    _promiseKeepers.set(dispatch, new PromiseKeeper());
  }
  return _promiseKeepers.get(dispatch);
}

export function makeSubActionsCreators(apiName, resourceName, reqDesc) {
  const subActions = {};

  subActions.reset = function (params, payload) {
    return {
      type: `${apiName}_${resourceName}_RESET`,
      meta: {
        key: getResourceKey(resourceName, params)
      },
      payload: payload || reqDesc.resourceData || {}
    };
  };

  subActions.start = function (params, payload) {
    return {
      type: `${apiName}_${resourceName}_START`,
      meta: {
        key: getResourceKey(resourceName, params)
      },
      payload: payload || reqDesc.resourceData || {}
    };
  };

  subActions.success = function (params, payload) {
    return {
      type: `${apiName}_${resourceName}_SUCCESS`,
      meta: {
        key: getResourceKey(resourceName, params)
      },
      payload
    };
  };

  subActions.fail = function (params, payload) {
    return {
      type: `${apiName}_${resourceName}_FAIL`,
      meta: {
        key: getResourceKey(resourceName, params)
      },
      payload,
      error: true
    };
  };

  return subActions;
}

/**
 * Creates dispatches for the sub actions
 *
 * @param {Function} dispatch - Dispatch from store
 * @param {RequestDescription} reqDesc - Request description
 * @param {Object} subActions - Generated subActions for action creators
 * @param {Object} params - Request path and query params
 * @param {Object} options - Request options
 * @returns {Function[]} dispatchers
 * @private
 */
export function createDispatchers(dispatch, reqDesc, subActions, params, options) {
  const dataTransform = reqDesc.dataTransform || defaultTransformer;
  const errorTransform = reqDesc.errorTransform || defaultTransformer;

  function onStart() {
    return dispatch(subActions.start(params));
  }

  function onResolved(data) {
    return dispatch(subActions.success(params, dataTransform(data, { params, options })));
  }

  function onRejected(data) {
    return dispatch(subActions.fail(params, errorTransform(data, { params, options })));
  }

  return [onStart, onResolved, onRejected];
}

/**
 * Check if duration between request and last response is less than required delay
 *
 * @param {String} key - Request state key
 * @param {RequestDescription} reqDesc - Request description
 * @param {Resource} resource - Resource
 * @param {Object} force - If the request delay should be ignored
 * @returns {Boolean} result
 * @private
 */
export function shouldThrottle(key, reqDesc, resource, force) {
  if (!resource || force) return false;

  const repeatRequestDelay = reqDesc.hasOwnProperty('repeatRequestDelay')
    ? reqDesc.repeatRequestDelay : constants.REPEAT_REQUEST_DELAY_DEFAULT;
  const responseDuration = Date.now() - resource.responseTime;
  return !!resource && responseDuration < repeatRequestDelay;
}

/**
 * Get request options allow for functions with access to redux getState
 *
 * @param {Object|Function} apiOptions - Options define at API level
 * @param {Object|Function} reqOptions - Options define at resource level
 * @param {Object|Function} actionOptions - Options set by action
 * @param {Function} getState - Get Redux state
 * @returns {Object} options
 * @private
 */
export function getRequestOptions(apiOptions, reqOptions, actionOptions, getState) {
  return {
    ...(isFunction(apiOptions) ? apiOptions(getState) : apiOptions),
    ...(isFunction(reqOptions) ? reqOptions(getState) : reqOptions),
    ...(isFunction(actionOptions) ? actionOptions(getState) : actionOptions)
  };
}

/**
 * Generate the actionCreator functions
 *
 * @param {String} apiName - Name of the REST API
 * @param {ApiDescription} apiDesc - Description object of target REST API
 * @param {ApiConfig} [apiConfig] - Optional configuration settings
 * @returns {Object.<String, ActionCreatorFn>} actionCreators
 * @private
 */
export default function createActionCreators(apiName, apiDesc, apiConfig = {}) {
  const { options: apiOptions = {}} = apiConfig;
  return Object.keys(apiDesc).reduce((acc, name) => {
    const reqDesc = apiDesc[name];
    const { options: reqOptions = {}} = reqDesc;
    const resourceName = reqDesc.resourceAlias || name;
    const subActions = makeSubActionsCreators(apiName, resourceName, reqDesc);

    /**
     * Action creator which kicks off request and creates lifecycle actions.
     * The sub-action creators are used during the lifecycle of a request to dispatch
     * updates to a resource in redux state. They are also exposed should
     * direct developer access be needed.
     *
     * @typedef {Function} ActionCreatorFn
     *
     * @param {Object} params - Params applied to the url path or query
     * @param {Object|OptionsFn} [options] - Options to be passed to the request adapter
     * @returns {ActionCreatorThunkFn} thunk
     *
     * @property {SubActionCreatorFn} reset - Reset resource to baseline
     * @property {SubActionCreatorFn} start - Set resource to isUpdate
     * @property {SubActionCreatorFn} success - Update resource to be loaded with value from a response
     * @property {SubActionCreatorFn} fail - Update resource with error as returned from a response
     */
    acc[name] = (params, options = {}) => {
      const { force = false } = options;

      /**
       * Thunk will actually dispatch an Action only if:
       *   1. it is not debounced
       *   2. it is not throttled
       *
       * Thunk will always return a resolving promise with either:
       *   1. new action being dispatched
       *   2. same action being dispatched if debounced
       *   3. previous action dispatched if throttled
       *
       * @typedef {Function} ActionCreatorThunkFn
       *
       * @param {Function} dispatch - Redux store dispatcher
       * @param {Function} getState - Get redux store state
       * @returns {Promise.<Action>} promise
       */
      return (dispatch, getState) => {
        const promiseKeeper = getPromiseKeeper(dispatch);
        const key = getResourceKey(resourceName, params);
        const promiseKey = `${apiName}-${key}`;
        const resource = getState()[apiName] ? getState()[apiName][key] : null;

        // debounce request
        if (promiseKeeper.has(promiseKey)) return promiseKeeper.get(promiseKey);

        if (shouldThrottle(key, reqDesc, resource, force)) {
          return Promise.resolve(resource.hasError ?
            subActions.fail(params, resource.error) :
            subActions.success(params, resource.value)
          );
        }

        const allOptions = getRequestOptions(apiOptions, reqOptions, options, getState);
        const [onStart, onResolved, onRejected] = createDispatchers(dispatch, reqDesc, subActions, params, allOptions);

        onStart();
        const url = transformUrl(getUrlTemplate(reqDesc.url, getState), params);
        const promise = makeRequest(reqDesc.method, url, { ...allOptions }, apiConfig)
          .then(onResolved, onRejected);
        promiseKeeper.set(promiseKey, promise);
        return promise;
      };
    };

    // Expose subActions statically from action
    Object.keys(subActions).map(k => { acc[name][k] = subActions[k]; });
    acc[name].subActions = subActions;
    return acc;
  }, {});
}

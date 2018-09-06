import { parseApiDesc } from './utils';
import { setRequestAdapter } from './requestAdapter';
import createActionCreators from './actionCreators';
import createReducer from './reducers';
import createSelectors from './selectors';
import PromiseKeeper from './promiseKeeper';


/**
 * Main class which manages RESTful requests and state with Redux.
 *
 * @public
 */
class Reduxful {

  /**
   * Create new RESTful configuration for Redux.
   *
   * @param {String} apiName - Name of the REST API
   * @param {ApiDescription} apiDesc - Description object of target REST API
   * @param {ApiConfig} [apiConfig] - Optional configuration settings
   * @param {RequestAdapter} [apiConfig.requestAdapter] - Request adapter to use
   * @param {Object|OptionsFn} [apiConfig.options] - Options to be passed to the request adapter
   */
  constructor(apiName, apiDesc, apiConfig = {}) {
    this.name = apiName;
    this._apiDesc = parseApiDesc(apiDesc);
    this._promiseKeeper = new PromiseKeeper();
    this._actionCreators = createActionCreators(this.name, this._apiDesc, this._promiseKeeper, apiConfig);
    this._reducer = createReducer(this.name);
    this._selectors = createSelectors(this.name, this._apiDesc);
  }

  /**
   * Property
   *
   * @returns {Object.<String, ActionCreatorFn>} redux action creators
   */
  get actionCreators() {
    return this._actionCreators;
  }

  /**
   * Alias to actionCreators
   *
   * @returns {Object.<String, ActionCreatorFn>} redux action creators
   */
  get actions() {
    return this._actionCreators;
  }

  /**
   * Property
   *
   * @returns {Object.<String, ReducerFn>} redux reducers
   */
  get reducers() {
    return { [this.name]: this._reducer };
  }

  /**
   * Alias to reducers
   *
   * @returns {Object.<String, ReducerFn>} redux reducers
   */
  get reducerMap() {
    return this.reducers;
  }

  /**
   * Property
   *
   * @returns {Object.<String, SelectorFn>} redux selectors
   */
  get selectors() {
    return this._selectors;
  }
}

Reduxful.setRequestAdapter = setRequestAdapter;

/**
 * Create new RESTful configuration for Redux.
 *
 * @param {String} apiName - Name of the REST API
 * @param {ApiDescription} apiDesc - Description object of target REST API
 * @param {Object} [config] - Optional configuration settings
 * @param {RequestAdapter} [config.requestAdapter] - Request adapter to use
 * @param {Object|OptionsFn} [config.options] - Options to be passed to the request adapter
 * @returns {Reduxful} instance
 */
function setupApi(apiName, apiDesc, config) {
  return new Reduxful(apiName, apiDesc, config);
}


export {
  Reduxful as default,
  setupApi
};

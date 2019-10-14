/**
 * Main class which manages RESTful requests and state with Redux.
 *
 * @public
 */
declare class Reduxful {
    /**
     * Create new RESTful configuration for Redux.
     *
     * @param {string} apiName - Name of the REST API
     * @param {ApiDescription} apiDesc - Description object of target REST API
     * @param {ApiConfig} [apiConfig] - Optional configuration settings
     * @param {RequestAdapter} [apiConfig.requestAdapter] - Request adapter to use
     * @param {object|OptionsFn} [apiConfig.options] - Options to be passed to the request adapter
     */
    constructor(apiName: string, apiDesc: any, apiConfig?: any);
    name: string;
    _apiDesc: any;
    _promiseKeeper: PromiseKeeper;
    _actionCreators: {
        [x: string]: any;
    };
    _reducer: any;
    _selectors: {};
    /**
     * Property
     *
     * @returns {Object.<string, ActionCreatorFn>} redux action creators
     */
    get actionCreators(): {
        [x: string]: any;
    };
    /**
     * Alias to actionCreators
     *
     * @returns {Object.<string, ActionCreatorFn>} redux action creators
     */
    get actions(): {
        [x: string]: any;
    };
    /**
     * Property
     *
     * @returns {Object.<string, ReducerFn>} redux reducers
     */
    get reducers(): {
        [x: string]: any;
    };
    /**
     * Alias to reducers
     *
     * @returns {Object.<string, ReducerFn>} redux reducers
     */
    get reducerMap(): {
        [x: string]: any;
    };
    /**
     * Property
     *
     * @returns {Object.<string, SelectorFn>} redux selectors
     */
    get selectors(): {
        [x: string]: any;
    };
}
declare namespace Reduxful {
    export { setRequestAdapter };
    import { setRequestAdapter } from "./requestAdapter";
}
/**
 * Create new RESTful configuration for Redux.
 *
 * @param {string} apiName - Name of the REST API
 * @param {ApiDescription} apiDesc - Description object of target REST API
 * @param {ApiConfig} [config] - Optional configuration settings
 * @param {RequestAdapter} [config.requestAdapter] - Request adapter to use
 * @param {object|OptionsFn} [config.options] - Options to be passed to the request adapter
 * @returns {Reduxful} instance
 */
export function setupApi(apiName: string, apiDesc: any, config?: any): Reduxful;
import PromiseKeeper from "./promiseKeeper";
export { Reduxful as default };

export function makeSubActionsCreators(apiName: any, resourceName: any, reqDesc: any): {
    reset(params: any, payload: any): {
        type: string;
        meta: {
            key: string;
        };
        payload: any;
    };
    start(params: any, payload: any): {
        type: string;
        meta: {
            key: string;
        };
        payload: any;
    };
    success(params: any, payload: any): {
        type: string;
        meta: {
            key: string;
        };
        payload: any;
    };
    fail(params: any, payload: any): {
        type: string;
        meta: {
            key: string;
        };
        payload: any;
        error: boolean;
    };
};
/**
 * Creates dispatches for the sub actions
 *
 * @param {Function} dispatch - Dispatch from store
 * @param {RequestDescription} reqDesc - Request description
 * @param {object} subActions - Generated subActions for action creators
 * @param {object} params - Request path and query params
 * @returns {Function[]} dispatchers
 * @private
 */
export function createDispatchers(dispatch: Function, reqDesc: any, subActions: any, params: any): Function[];
/**
 * Check if duration between request and last response is less than required delay
 *
 * @param {string} key - Request state key
 * @param {RequestDescription} reqDesc - Request description
 * @param {Resource} resource - Resource
 * @param {object} force - If the request delay should be ignored
 * @returns {boolean} result
 * @private
 */
export function shouldThrottle(key: string, reqDesc: any, resource: any, force: any): boolean;
/**
 * Get request options allow for functions with access to redux getState
 *
 * @param {object|Function} apiOptions - Options define at API level
 * @param {object|Function} reqOptions - Options define at resource level
 * @param {object|Function} actionOptions - Options set by action
 * @param {Function} getState - Get Redux state
 * @returns {object} options
 * @private
 */
export function getRequestOptions(apiOptions: any, reqOptions: any, actionOptions: any, getState: Function): any;
/**
 * Generate the actionCreator functions
 *
 * @param {string} apiName - Name of the REST API
 * @param {ApiDescription} apiDesc - Description object of target REST API
 * @param {PromiseKeeper} promiseKeeper - Track existing promises for debouncing
 * @param {ApiConfig} [apiConfig] - Optional configuration settings
 * @returns {Object.<string, ActionCreatorFn>} actionCreators
 * @private
 */
export default function createActionCreators(apiName: string, apiDesc: any, promiseKeeper: any, apiConfig?: any): {
    [x: string]: any;
};

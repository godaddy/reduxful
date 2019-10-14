/**
 * RequestAdapter structure
 *
 * @typedef {Function} RequestAdapter
 * @param {RequestAdapterOptions} options
 * @returns {Promise}
 */
/**
 * RequestAdapter Options
 *
 * @typedef {object} RequestAdapterOptions
 * @property {object} options
 * @property {string} options.method - HTTP method to use (GET, POST, etc.)
 * @property {string} options.url - URL to call
 * @property {Object.<string,string>} options.headers - Header for request
 * @property {boolean} options.withCredentials - Should cookies be passed for cross-origin requests
 * @property {*} options.body - Optional body of request
 */
/**
 * Get the registered request adapter.
 *
 * @returns {RequestAdapter} requestAdapter
 * @private
 */
export function getRequestAdapter(): Function;
/**
 * Register an ajax request adapter.
 *
 * @param {RequestAdapter} requestAdapter - Request adapter to use
 * @public
 */
export function setRequestAdapter(requestAdapter: Function): void;
/**
 * Makes a request using the request adapter defined by api config the global default.
 *
 * @param {string} method - Request HTTP Method
 * @param {string} url - Transformed URL of the rest endpoint
 * @param {object} [options] - Additional request options
 * @param {ApiConfig} [config] - Api configuration
 * @returns {Promise} promise
 * @private
 */
export function makeRequest(method: string, url: string, options?: any, config?: any): Promise<any>;
/**
 * RequestAdapter structure
 */
export type RequestAdapter = Function;
/**
 * RequestAdapter Options
 */
export type RequestAdapterOptions = {
    options: {
        /**
         * - HTTP method to use (GET, POST, etc.)
         */
        method: string;
        /**
         * - URL to call
         */
        url: string;
        /**
         * - Header for request
         */
        headers: {
            [x: string]: string;
        };
        /**
         * - Should cookies be passed for cross-origin requests
         */
        withCredentials: boolean;
        /**
         * - Optional body of request
         */
        body: any;
    };
};

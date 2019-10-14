/**
 * Check if object is a function.
 *
 * @param {*} maybeFn - Potential function
 * @returns {boolean} result
 * @private
 */
export function isFunction(maybeFn: any): boolean;
/**
 * Builds the resource key based on the parameters passed.
 *
 * @param {string} reqName - Name of the API request.
 * @param {Object.<string, string|number>} params - Parameters used as URL or Query params
 * @returns {string} resource key
 */
export function getResourceKey(reqName: string, params: {
    [x: string]: string | number;
}): string;
/**
 * Helper function to check if a Resource has been loaded.
 *
 * @param {Resource} resource - Resource object
 * @returns {boolean} result
 */
export function isLoaded(resource: any): boolean;
/**
 * Helper function to check of a Resource is being updated.
 *
 * @param {Resource} resource - Resource object
 * @returns {boolean} result
 */
export function isUpdating(resource: any): boolean;
/**
 * Helper function to check if a Resource has an error.
 *
 * @param {Resource} resource - Resource object
 * @returns {boolean} result
 */
export function hasError(resource: any): boolean;
/**
 * Inspect and align Request Description object.
 *
 * @param {RequestDescription} reqDesc - Request Description object
 * @returns {RequestDescription} reqDesc
 * @private
 */
export function parseReqDesc(reqDesc: any): any;
/**
 * Inspect and align API Description object.
 *
 * @param {ApiDescription} apiDesc - Api Description object
 * @returns {ApiDescription} apiDesc
 * @private
 */
export function parseApiDesc(apiDesc: any): any;
/**
 * Get the url template from static string or dynamically with redux state.
 *
 * @param {string|Function} url - Url template
 * @param {Function} getState - Get Redux state
 * @returns {string} url
 * @private
 */
export function getUrlTemplate(url: TimerHandler, getState: Function): string;
/**
 * Determines whether a string begins with the characters of a specified string
 *
 * @param {string} str - string to check
 * @param {string} search - string to search for at the start
 * @returns {boolean} result
 * @private
 */
export function startsWith(str: string, search: string): boolean;
/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {string} str - string to check
 * @param {string} search - string to search for at the end
 * @returns {boolean} result
 * @private
 */
export function endsWith(str: string, search: string): boolean;

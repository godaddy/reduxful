/**
 * Make an adapter to match the RequestAdapter interface using Fetch
 *
 * @param {Function} fetcher - Fetch API or ponyfill
 * @param {object} [defaultOptions] - Any default request options
 * @returns {Function} fetchAdapter
 */
export function makeFetchAdapter(fetcher: Function, defaultOptions?: any): Function;
export namespace handlers { }

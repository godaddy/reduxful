import { startsWith, endsWith } from './utils';

export const handlers = {};

handlers.onReset = function (state, action) {
  const { meta: { key }, payload: value } = action;
  return {
    ...state,
    [key]: {
      isLoaded: false,
      hasError: false,
      isUpdating: false,
      value,
      error: null,
      requestTime: null,
      responseTime: null
    }
  };
};

handlers.onStart = function (state, action) {
  const { meta: { key }, payload: value } = action;
  return {
    ...state,
    [key]: {
      isLoaded: false,
      hasError: false,
      value,
      ...state[key],
      isUpdating: true,
      requestTime: Date.now(),
      responseTime: null
    }
  };
};

handlers.onComplete = function (state, action) {
  const { meta: { key }, payload, error } = action;
  const hasError = error === true;
  return {
    ...state,
    [key]: {
      ...state[key],
      value: !hasError ? payload : null,
      error: hasError ? payload : null,
      isLoaded: !hasError,
      hasError,
      isUpdating: false,
      responseTime: Date.now()
    }
  };
};

/**
 * Creates a reducer which handles actions for a given api name.
 *
 * @param {string} apiName - Name of the api
 * @returns {ReducerFn} reducer
 * @private
 */
export default function createReducer(apiName) {
  return function reducer(state = {}, action) {
    if (startsWith(action.type, apiName)) {
      if (endsWith(action.type, 'RESET')) return handlers.onReset(state, action);
      if (endsWith(action.type, 'START')) return handlers.onStart(state, action);
      if (endsWith(action.type, 'SUCCESS') || endsWith(action.type, 'FAIL')) return handlers.onComplete(state, action);
    }
    return state;
  };
}

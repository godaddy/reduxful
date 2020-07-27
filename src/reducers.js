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
 * @param {String} apiName - Name of the api
 * @returns {ReducerFn} reducer
 * @private
 */
export default function createReducer(apiName) {
  const reApiAction = new RegExp(`${apiName}_(RESET|START|SUCCESS|FAIL)`);
  return function reducer(state = {}, action) {
    const match = reApiAction.exec(action.type);
    if (match) {
      const type = match[1];
      if (type === 'RESET') return handlers.onReset(state, action);
      if (type === 'START') return handlers.onStart(state, action);
      if (type === 'SUCCESS' || type === 'FAIL') return handlers.onComplete(state, action);
    }
    return state;
  };
}

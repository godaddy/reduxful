import createReducer, { handlers } from '../src/reducers';
import { mockApiName } from './fixtures/mockApi';

const mockStartActionType = 'mockApi_START';
const mockSuccessActionType = 'mockApi_SUCCESS';
const mockFailActionType = 'mockApi_FAIL';
const mockResetActionType = 'mockApi_RESET';
const mockKey = 'getSomething__var:one';
const mockValue = { someData: 'bogus data string' };
const mockError = { code: 500, message: 'Something terrible happened' };
const mockStartAction = {
  meta: {
    key: mockKey
  },
  payload: {}
};
const mockSuccessAction = {
  meta: {
    key: mockKey
  },
  payload: mockValue
};
const mockErrorAction = {
  meta: {
    key: mockKey
  },
  payload: mockError,
  error: true
};
const mockResetAction = {
  meta: {
    key: mockKey
  },
  payload: {}
};
const mockStartResource = {
  value: {},
  isLoaded: false,
  isUpdating: true
};
const mockSuccessResource = {
  value: mockValue,
  error: null,
  isLoaded: true,
  isUpdating: false
};
const mockFailResource = {
  value: null,
  error: mockError,
  isLoaded: true,
  isUpdating: false,
  hasError: true
};

describe('Reducers', () => {
  describe('createReducer', () => {

    it('creates a reducer', () => {
      const reducer = createReducer(mockApiName);
      expect(reducer).toBeInstanceOf(Function);
    });
  });
  describe('reducer', () => {
    let reducer;
    beforeAll(() => {
      reducer = createReducer(mockApiName);
      jest.spyOn(handlers, 'onStart');
      jest.spyOn(handlers, 'onComplete');
      jest.spyOn(handlers, 'onReset');
    });
    afterEach(() => {
      handlers.onStart.mockReset();
      handlers.onComplete.mockReset();
      handlers.onReset.mockReset();
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('defaults state to empty object if undefined', () => {
      // eslint-disable-next-line no-undefined
      const outState = reducer(undefined, { type: 'BAD_ACTION' });
      expect(outState).toBeInstanceOf(Object);
      expect(outState).toEqual({});
    });

    it('returns original state if unsupported action prefix', () => {
      const inState = { bogus: 'bogus' };
      const outState = reducer(inState, { type: 'BAD_ACTION' });
      expect(outState).toBe(inState);
    });

    it('returns original state if unsupported action suffix', () => {
      const inState = { bogus: 'bogus' };
      const outState = reducer(inState, { type: 'mockApi_BOGUS' });
      expect(outState).toBe(inState);
    });

    it('calls start handler for START actions', () => {
      const inState = { bogus: 'bogus' };
      const outState = reducer(inState, { type: mockStartActionType });
      expect(outState).not.toBe(inState);
      expect(handlers.onStart).toHaveBeenCalled();
      expect(handlers.onComplete).not.toHaveBeenCalled();
    });

    it('calls complete handler for SUCCESS actions', () => {
      const inState = { bogus: 'bogus' };
      const outState = reducer(inState, { type: mockSuccessActionType });
      expect(outState).not.toBe(inState);
      expect(handlers.onStart).not.toHaveBeenCalled();
      expect(handlers.onComplete).toHaveBeenCalled();
    });

    it('calls complete handler for FAIL actions', () => {
      const inState = { bogus: 'bogus' };
      const outState = reducer(inState, { type: mockFailActionType });
      expect(outState).not.toBe(inState);
      expect(handlers.onStart).not.toHaveBeenCalled();
      expect(handlers.onComplete).toHaveBeenCalled();
    });

    it('calls reset handler for RESET actions', () => {
      const inState = { bogus: 'bogus' };
      const outState = reducer(inState, { type: mockResetActionType });
      expect(outState).not.toBe(inState);
      expect(handlers.onStart).not.toHaveBeenCalled();
      expect(handlers.onComplete).not.toHaveBeenCalled();
      expect(handlers.onReset).toHaveBeenCalled();
    });

    it('does not handler for similarly named apis', () => {
      const inState = { bogus: 'bogus' };
      reducer(inState, { type: 'mockApi_2_START' });
      reducer(inState, { type: 'mockApi2_START' });
      expect(handlers.onStart).not.toHaveBeenCalled();
    });
  });
  describe('handleStart', () => {

    it('returns a modified state', () => {
      const inState = { bogus: 'bogus' };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState).not.toBe(inState);
      expect(outState).not.toEqual(inState);
    });

    it('add new resource entry if does not exists', () => {
      const inState = {};
      const outState = handlers.onStart(inState, mockStartAction);
      expect(inState).not.toHaveProperty(mockKey);
      expect(outState).toHaveProperty(mockKey);
    });

    it('modifies previous resource entry if exists', () => {
      const inState = { [mockKey]: mockSuccessResource };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(inState).toHaveProperty(mockKey);
      expect(outState).toHaveProperty(mockKey);
    });

    it('sets isUpdating to true', () => {
      const inState = { [mockKey]: mockSuccessResource };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(inState[mockKey]).toHaveProperty('isUpdating', false);
      expect(outState[mockKey]).toHaveProperty('isUpdating', true);
    });

    it('sets isLoaded to false for new resources', () => {
      const inState = { };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState[mockKey]).toHaveProperty('isLoaded', false);
    });

    it('maintains previous isLoaded status for existing resources', () => {
      const inState = { [mockKey]: mockSuccessResource };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState[mockKey]).toHaveProperty('isLoaded', true);
    });

    it('maintains previous hasError status for existing resources', () => {
      const inState = { [mockKey]: { ...mockSuccessResource, hasError: true }};
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState[mockKey]).toHaveProperty('hasError', true);
    });

    it('maintains previous value for existing resources', () => {
      const inState = { [mockKey]: mockSuccessResource };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState[mockKey]).toHaveProperty('value', mockValue);
    });

    it('maintains previous error for existing resources', () => {
      const inState = { [mockKey]: mockFailResource };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState[mockKey]).toHaveProperty('error', mockError);
    });

    it('sets requestTime', () => {
      const inState = { [mockKey]: mockSuccessResource };
      const outState = handlers.onStart(inState, mockStartAction);
      expect(outState[mockKey]).toHaveProperty('requestTime');
      expect(Number.isInteger(outState[mockKey].requestTime)).toBe(true);
    });

    it('updates requestTime', () => {
      const inState = { [mockKey]: { ...mockSuccessResource, requestTime: 123456 }};
      const outState = handlers.onStart(inState, mockStartAction);
      expect(inState[mockKey]).toHaveProperty('requestTime', 123456);
      expect(outState[mockKey]).not.toHaveProperty('requestTime', 123456);
    });
  });
  describe('handleComplete', () => {

    it('returns a modified state', () => {
      const inState = { bogus: 'bogus' };
      const outState = handlers.onComplete(inState, mockSuccessAction);
      expect(outState).not.toBe(inState);
      expect(outState).not.toEqual(inState);
    });

    it('sets isUpdating to false', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockSuccessAction);
      expect(inState[mockKey]).toHaveProperty('isUpdating', true);
      expect(outState[mockKey]).toHaveProperty('isUpdating', false);
    });

    it('sets isLoaded true', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockSuccessAction);
      expect(inState[mockKey]).toHaveProperty('isLoaded', false);
      expect(outState[mockKey]).toHaveProperty('isLoaded', true);
    });

    it('sets hasError false by default', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockSuccessAction);
      expect(outState[mockKey]).toHaveProperty('hasError', false);
    });

    it('sets hasError true if error in action', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockErrorAction);
      expect(outState[mockKey]).toHaveProperty('hasError', true);
    });

    it('updates value from payload', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockSuccessAction);
      expect(outState[mockKey]).toHaveProperty('value', mockValue);
    });

    it('updates error to null', () => {
      const inState = { [mockKey]: mockFailResource };
      const outState = handlers.onComplete(inState, mockSuccessAction);
      expect(outState[mockKey]).toHaveProperty('error', null);
    });

    it('if error, updates value to null', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockErrorAction);
      expect(outState[mockKey]).toHaveProperty('value', null);
    });

    it('if error, updates error from payload', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onComplete(inState, mockErrorAction);
      expect(outState[mockKey]).toHaveProperty('error', mockError);
    });

    it('updates responseTime', () => {
      const inState = { [mockKey]: { ...mockSuccessResource, responseTime: 123456 }};
      const outState = handlers.onStart(inState, mockStartAction);
      expect(inState[mockKey]).toHaveProperty('responseTime', 123456);
      expect(outState[mockKey]).not.toHaveProperty('responseTime', 123456);
    });
  });
  describe('handleReset', () => {

    it('returns a modified state', () => {
      const inState = { bogus: 'bogus' };
      const outState = handlers.onReset(inState, mockResetAction);
      expect(outState).not.toBe(inState);
      expect(outState).not.toEqual(inState);
    });

    it('sets isUpdating to false', () => {
      const inState = { [mockKey]: mockStartResource };
      const outState = handlers.onReset(inState, mockResetAction);
      expect(inState[mockKey]).toHaveProperty('isUpdating', true);
      expect(outState[mockKey]).toHaveProperty('isUpdating', false);
    });

    it('sets isLoaded to false', () => {
      const inState = { [mockKey]: mockSuccessResource };
      const outState = handlers.onReset(inState, mockResetAction);
      expect(inState[mockKey]).toHaveProperty('isLoaded', true);
      expect(outState[mockKey]).toHaveProperty('isLoaded', false);
    });

    it('sets hasLoaded to false', () => {
      const inState = { [mockKey]: mockFailResource };
      const outState = handlers.onReset(inState, mockResetAction);
      expect(inState[mockKey]).toHaveProperty('hasError', true);
      expect(outState[mockKey]).toHaveProperty('hasError', false);
    });

    it('sets error to null', () => {
      const inState = { [mockKey]: mockFailResource };
      const outState = handlers.onReset(inState, mockResetAction);
      expect(inState[mockKey]).toHaveProperty('error', mockError);
      expect(outState[mockKey]).toHaveProperty('error', null);
    });

    it('sets value to payload', () => {
      const inState = { [mockKey]: mockSuccessResource };
      expect(inState[mockKey]).toHaveProperty('value', mockValue);

      let outState = handlers.onReset(inState, mockResetAction);
      expect(outState[mockKey]).toHaveProperty('value', {});
      outState = handlers.onReset(inState, { ...mockResetAction, payload: 'BOGUS' });
      expect(outState[mockKey]).toHaveProperty('value', 'BOGUS');
    });
  });
});

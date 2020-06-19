/* eslint-disable no-process-env, max-nested-callbacks */

import createActionCreators, {
  makeSubActionsCreators,
  createDispatchers,
  getRequestOptions,
  shouldThrottle
} from '../src/actionCreators';
import * as requestAdapter from '../src/requestAdapter';
import { mockApiName, mockApiDesc } from './fixtures/mockApi';

const mockPayload = { some: 'data' };
const mockParams = { id: 1234 };
const mockKey = 'getFruit__id:1234';

const fsaProperties = ['type', 'payload', 'error', 'meta'];

describe('ActionCreators', () => {
  let results;

  describe('subActions', () => {
    let subActions;

    beforeAll(() => {
      subActions = makeSubActionsCreators(mockApiName, 'getFruit', mockApiDesc.getFruit);
    });

    describe('makeSubActionsCreators', () => {
      it('returns an object of actionCreator functions', () => {
        results = makeSubActionsCreators(mockApiName, 'getFruit', mockApiDesc.getFruit);
        expect(results).toBeInstanceOf(Object);
        expect(results).toHaveProperty('start', expect.any(Function));
        expect(results).toHaveProperty('success', expect.any(Function));
        expect(results).toHaveProperty('fail', expect.any(Function));
      });
    });

    describe('START', () => {

      it('returns start action type for api name', () => {
        results = subActions.start();
        expect(results).toHaveProperty('type', 'mockApi_getFruit_START');
      });

      it('returns key in action meta', () => {
        results = subActions.start(mockParams);
        expect(results).toHaveProperty('meta', expect.any(Object));
        expect(results.meta).toHaveProperty('key', mockKey);
      });

      it('only contains FSA properties', () => {
        const action = subActions.start(mockParams);
        const keys = Object.keys(action);
        expect(keys.every(k => fsaProperties.includes(k))).toBe(true);
      });

      it('returns passed payload', () => {
        results = subActions.start(mockParams, mockPayload);
        expect(results).toHaveProperty('payload', mockPayload);
      });

      it('returns default payload if no payload provided', () => {
        results = subActions.start(mockParams);
        expect(results).toHaveProperty('payload', {});
      });
    });

    describe('RESET', () => {

      it('returns reset action type for api name', () => {
        results = subActions.reset();
        expect(results).toHaveProperty('type', 'mockApi_getFruit_RESET');
      });

      it('returns key in action meta', () => {
        results = subActions.reset(mockParams);
        expect(results).toHaveProperty('meta', expect.any(Object));
        expect(results.meta).toHaveProperty('key', mockKey);
      });

      it('only contains FSA properties', () => {
        const action = subActions.reset(mockParams);
        const keys = Object.keys(action);
        expect(keys.every(k => fsaProperties.includes(k))).toBe(true);
      });

      it('returns passed payload', () => {
        results = subActions.reset(mockParams, mockPayload);
        expect(results).toHaveProperty('payload', mockPayload);
      });

      it('returns default payload if no payload provided', () => {
        results = subActions.reset(mockParams);
        expect(results).toHaveProperty('payload', {});
      });
    });

    describe('SUCCESS', () => {

      it('returns complete action type for api name', () => {
        results = subActions.success(mockParams);
        expect(results).toHaveProperty('type', 'mockApi_getFruit_SUCCESS');
      });

      it('returns key in action meta', () => {
        results = subActions.success(mockParams);
        expect(results).toHaveProperty('meta', expect.any(Object));
        expect(results.meta).toHaveProperty('key', mockKey);
      });

      it('only contains FSA properties', () => {
        const action = subActions.success(mockParams);
        const keys = Object.keys(action);
        expect(keys.every(k => fsaProperties.includes(k))).toBe(true);
      });

      it('returns payload', () => {
        results = subActions.success(mockParams, mockPayload);
        expect(results).toHaveProperty('payload', mockPayload);
      });

      it('does not return error in action', () => {
        results = subActions.success(mockParams);
        expect(results).not.toHaveProperty('error');
      });
    });

    describe('FAIL', () => {

      it('returns complete action type for api name', () => {
        results = subActions.fail(mockParams);
        expect(results).toHaveProperty('type', 'mockApi_getFruit_FAIL');
      });

      it('returns key in action meta', () => {
        results = subActions.fail(mockParams);
        expect(results).toHaveProperty('meta', expect.any(Object));
        expect(results.meta).toHaveProperty('key', mockKey);
      });

      it('only contains FSA properties', () => {
        const action = subActions.fail(mockParams);
        const keys = Object.keys(action);
        expect(keys.every(k => fsaProperties.includes(k))).toBe(true);
      });

      it('returns payload', () => {
        results = subActions.fail(mockParams, mockPayload);
        expect(results).toHaveProperty('payload', mockPayload);
      });

      it('returns error=true in action', () => {
        results = subActions.fail(mockParams);
        expect(results).toHaveProperty('error', true);
      });
    });
  });

  describe('getRequestOptions', () => {
    let mockGetState;

    beforeEach(() => {
      mockGetState = jest.fn();
    });

    it('allows options as objects', () => {
      results = getRequestOptions({ api: 1 }, { req: 2 }, { action: 3 }, mockGetState);
      expect(results).toEqual({
        api: 1,
        req: 2,
        action: 3
      });
    });

    it('allows options as functions', () => {
      results = getRequestOptions(() => ({ api: 1 }), () => ({ req: 2 }), () => ({ action: 3 }), mockGetState);
      expect(results).toEqual({
        api: 1,
        req: 2,
        action: 3
      });
    });

    it('action options override request options', () => {
      results = getRequestOptions({}, { bogus: 'B' }, { bogus: 'C' }, mockGetState);
      expect(results).toEqual({ bogus: 'C' });
    });

    it('request options override api options', () => {
      results = getRequestOptions({ bogus: 'A' }, { bogus: 'B' }, {}, mockGetState);
      expect(results).toEqual({ bogus: 'B' });
    });

    it('functions access redux getState', () => {
      mockGetState
        .mockReturnValueOnce({ api: 1 })
        .mockReturnValueOnce({ req: 2 })
        .mockReturnValue({ action: 3 });

      const f = (getState) => getState();
      results = getRequestOptions(f, f, f, mockGetState);

      expect(mockGetState).toHaveBeenCalledTimes(3);
      expect(results).toEqual({
        api: 1,
        req: 2,
        action: 3
      });
    });
  });

  describe('factory', () => {

    it('creates a map of functions', () => {
      const actions = createActionCreators(mockApiName, mockApiDesc);
      expect(actions).toBeInstanceOf(Object);
      expect(actions).toHaveProperty('getFruit');
      expect(actions.getFruit).toBeInstanceOf(Function);
    });

    it('attaches sub-actionCreator functions', () => {
      const actions = createActionCreators(mockApiName, mockApiDesc);
      expect(actions.getFruit).toHaveProperty('start', expect.any(Function));
      expect(actions.getFruit).toHaveProperty('success', expect.any(Function));
      expect(actions.getFruit).toHaveProperty('fail', expect.any(Function));
    });
  });

  describe('dispatchers', () => {
    let mockDataTransform, mockErrorTransform, dispatch, subActions, onStart, onResolved, onRejected;

    beforeEach(() => {
      dispatch = jest.fn();
      mockDataTransform = jest.fn();
      mockErrorTransform = jest.fn();
      const mockReqDesc = {
        url: '/proto/fruits/:id',
        dataTransform: mockDataTransform,
        errorTransform: mockErrorTransform
      };
      subActions = {
        start: jest.fn(),
        success: jest.fn(),
        fail: jest.fn()
      };
      [onStart, onResolved, onRejected] = createDispatchers(dispatch, mockReqDesc, subActions, mockParams);
    });

    describe('onStart', () => {
      it('dispatches start', () => {
        onStart();
        expect(subActions.start).toHaveBeenCalled();
      });
    });

    describe('onResolved', () => {
      it('dispatches success', () => {
        onResolved();
        expect(subActions.success).toHaveBeenCalled();
      });

      it('executes dataTransform', () => {
        const mockData = { bogus: 'BOGUS' };
        onResolved(mockData);
        expect(mockDataTransform).toHaveBeenCalledWith(mockData, { params: mockParams });
      });
    });

    describe('onRejected', () => {
      it('dispatches success', () => {
        onRejected();
        expect(subActions.fail).toHaveBeenCalled();
      });

      it('executes errorTransform', () => {
        const mockError = { something: 'terrible' };
        onRejected(mockError);
        expect(mockErrorTransform).toHaveBeenCalledWith(mockError, { params: mockParams });
      });
    });
  });

  describe('generated', () => {
    let actions, dispatch, requestSpy, getState;

    beforeAll(() => {
      actions = createActionCreators(mockApiName, mockApiDesc);
      dispatch = jest.fn();
      ['getFruit', 'getFruits'].forEach(k => {
        ['start', 'success', 'fail'].forEach(sub => jest.spyOn(actions[k].subActions, sub));
      });
    });

    beforeEach(() => {
      requestSpy = jest.spyOn(requestAdapter, 'makeRequest').mockImplementation().mockResolvedValue({ name: 'Apricot' });
      dispatch.mockReset();
      dispatch.mockResolvedValue();
      getState = () => ({});
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('returns a thunk', () => {
      const thunk = actions.getFruit(mockParams);
      expect(thunk).toBeInstanceOf(Function);
    });

    it('thunk executes dispatch', () => {
      const thunk = actions.getFruit(mockParams);
      thunk(dispatch, getState);
      expect(dispatch).toHaveBeenCalled();
    });

    it('thunk dispatches start actionCreator', () => {
      const thunk = actions.getFruit(mockParams);
      thunk(dispatch, getState);
      expect(actions.getFruit.subActions.start).toHaveBeenCalledWith(mockParams);
    });

    it('thunk dispatches start actionCreator with default resource data', () => {
      const thunk = actions.getFruits();
      thunk(dispatch, getState);
      expect(actions.getFruits.subActions.start).toHaveBeenCalledWith(expect.undefined);
    });

    it('thunk makes request', () => {
      const thunk = actions.getFruit(mockParams);
      thunk(dispatch, getState);
      expect(requestAdapter.makeRequest).toHaveBeenCalled();
    });

    it('dispatches success actionCreator on successful response', (done) => {
      const thunk = actions.getFruit(mockParams);
      thunk(dispatch, getState).then(() => {
        expect(actions.getFruit.subActions.success).toHaveBeenCalled();
        done();
      });
    });

    it('dispatches fail actionCreator on erroneous response', (done) => {
      requestSpy.mockReset().mockRejectedValueOnce(false);

      const thunk = actions.getFruit(mockParams);
      thunk(dispatch, getState).then(() => {
        expect(actions.getFruit.subActions.fail).toHaveBeenCalled();
        done();
      });
    });

    describe('Throttling', () => {
      let nodeEnv, mockState;

      beforeAll(() => {
        nodeEnv = process.env.NODE_ENV;
      });

      beforeEach(() => {
        mockState = {
          [mockApiName]: {
            [mockKey]: {
              isLoaded: true,
              responseTime: Date.now()
            }
          }
        };
        getState = () => (mockState);
      });

      afterEach(() => {
        process.env.NODE_ENV = nodeEnv;
      });

      it('uses repeatRequestDelay on reqDesc', () => {
        const mockReqDesc = {
          url: '/proto/fruits/:id',
          repeatRequestDelay: 123
        };
        results = shouldThrottle(mockKey, mockReqDesc, { isLoaded: true, responseTime: Date.now() });
        expect(results).toBe(true);
      });

      it('uses default repeatRequestDelay if not on reqDesc', () => {
        const mockReqDesc = {
          url: '/proto/fruits/:id'
        };
        results = shouldThrottle(mockKey, mockReqDesc, { isLoaded: true, responseTime: Date.now() });
        expect(results).toBe(true);
      });

      it('does not throttle of no resource', () => {
        const mockReqDesc = {
          url: '/proto/fruits/:id'
        };
        results = shouldThrottle(mockKey, mockReqDesc, null);
        expect(results).toBe(false);
      });

      it('does not throttle of no resource.responseTime', () => {
        const mockReqDesc = {
          url: '/proto/fruits/:id'
        };
        results = shouldThrottle(mockKey, mockReqDesc, { value: 'bogus' });
        expect(results).toBe(false);
      });

      it('does throttle if early resource.responseTime', () => {
        const mockReqDesc = {
          url: '/proto/fruits/:id'
        };
        results = shouldThrottle(mockKey, mockReqDesc, { value: 'bogus', responseTime: Date.now() });
        expect(results).toBe(true);
      });

      it('does not throttle of no force=true', () => {
        const mockReqDesc = {
          url: '/proto/fruits/:id'
        };
        results = shouldThrottle(mockKey, mockReqDesc, { value: 'bogus', responseTime: Date.now() }, true);
        expect(results).toBe(false);
      });

      it('does not start request if repeated within delay', () => {
        const thunk = actions.getFruit(mockParams);
        thunk(dispatch, getState);
        expect(dispatch).not.toHaveBeenCalled();
      });

      it('starts request if repeated within delay but force=true', () => {
        const thunk = actions.getFruit(mockParams, { force: true });
        thunk(dispatch, getState);
        expect(dispatch).toHaveBeenCalled();
      });

      it('returns a promise even if throttled', () => {
        const thunk = actions.getFruit(mockParams);
        const firstPromise = thunk(dispatch, getState);
        const nextPromise = thunk(dispatch, getState);
        expect(firstPromise).toBeInstanceOf(Promise);
        expect(nextPromise).toBeInstanceOf(Promise);
        expect(firstPromise).not.toBe(nextPromise);
      });

      it('action from throttle promise should be the look the same', async () => {
        const thunk = actions.getFruit(mockParams);
        const firstAction = await thunk(dispatch, getState);
        const nextAction = await thunk(dispatch, getState);
        expect(firstAction).not.toBe(nextAction);
        expect(firstAction).toEqual(nextAction);
      });

      it('returned throttle promise can resolve a fail action', async () => {
        mockState[mockApiName][mockKey].hasError = true;
        mockState[mockApiName][mockKey].error = 'An error';

        const thunk = actions.getFruit(mockParams);
        const firstAction = await thunk(dispatch, getState);
        expect(firstAction.error).toBe(true);
        expect(firstAction.payload).toEqual('An error');
      });
    });

    describe('Debouncing', () => {

      it('thunk returns promise', () => {
        const thunk = actions.getFruit(mockParams);
        const promise = thunk(dispatch, getState);
        expect(promise).toHaveProperty('then');
        expect(promise).toHaveProperty('catch');
      });

      it('does not make new request if promise in flight', () => {
        const thunk = actions.getFruit(mockParams);
        thunk(dispatch, getState);
        thunk(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(1);
      });

      it('returns existing promise if in flight', () => {
        const thunk = actions.getFruit(mockParams);
        const firstPromise = thunk(dispatch, getState);
        const nextPromise = thunk(dispatch, getState);
        expect(firstPromise).toBe(nextPromise);
      });

      it('does not debounce if dispatched from a different store', () => {
        const otherDispatch = jest.fn();
        const thunk = actions.getFruit(mockParams);
        const firstPromise = thunk(dispatch, getState);
        const nextPromise = thunk(otherDispatch, getState);
        expect(firstPromise).not.toBe(nextPromise);
      });
    });
  });
});

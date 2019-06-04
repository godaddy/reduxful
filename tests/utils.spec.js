import {
  getResourceKey,
  isLoaded,
  isUpdating,
  hasError,
  isFunction,
  getUrlTemplate,
  parseReqDesc,
  parseApiDesc,
  startsWith,
  endsWith
} from '../src/utils';
import * as utils from '../src/utils';

const params = {
  id: 'user123',
  count: 777
};

describe('Utils', () => {

  describe('getResourceKey', () => {

    it('builds and returns the resource key based on all parameters', () => {
      const expectedResourceKey = 'getItem__count:777__id:user123';
      const resourceKey = getResourceKey('getItem', params);
      expect(resourceKey).toEqual(expectedResourceKey);
    });

    it('builds and returns the resource key based on all parameters using alias', () => {
      const expectedResourceKey = 'testResourceName__count:777__id:user123';
      const resourceKey = getResourceKey('testResourceName', params);
      expect(resourceKey).toEqual(expectedResourceKey);
    });

    it('builds and returns the resource key with empty parameter', () => {
      const expectedResourceKey = 'getItems';
      const resourceKey = getResourceKey('getItems');
      expect(resourceKey).toEqual(expectedResourceKey);
    });
  });

  describe('isLoaded', () => {

    it('false if resource not set', () => {
      expect(isLoaded(null)).toBeFalsy();
      expect(isLoaded()).toBeFalsy();
    });

    it('false if resource set but not loaded', () => {
      expect(isLoaded({ isLoaded: false })).toBeFalsy();
    });

    it('true if resource loaded', () => {
      expect(isLoaded({ isLoaded: true })).toBeTruthy();
    });
  });

  describe('isUpdating', () => {

    it('false if resource not set', () => {
      expect(isUpdating(null)).toBeFalsy();
      expect(isUpdating()).toBeFalsy();
    });

    it('false if resource set but not loaded', () => {
      expect(isUpdating({ isUpdating: false })).toBeFalsy();
    });

    it('true if resource loaded', () => {
      expect(isUpdating({ isUpdating: true })).toBeTruthy();
    });
  });

  describe('hasError', () => {

    it('false if resource is not set', () => {
      expect(hasError(null)).toBeFalsy();
      expect(hasError()).toBeFalsy();
    });

    it('false if resource is set but not loaded', () => {
      expect(hasError({ hasError: false })).toBeFalsy();
    });

    it('true if resource has error', () => {
      expect(hasError({ hasError: true })).toBeTruthy();
    });
  });

  describe('isFunction', () => {

    it('false if not a function', () => {
      expect(isFunction('a string')).toBeFalsy();
      expect(isFunction({})).toBeFalsy();
      expect(isFunction()).toBeFalsy();
    });

    it('true if function', () => {
      expect(isFunction(() => {})).toBeTruthy();
      expect(isFunction(function () {})).toBeTruthy();
    });
  });

  describe('getUrlTemplate', () => {

    it('returns same url if string', () => {
      expect(getUrlTemplate('a string')).toEqual('a string');
    });

    it('returns url string if a function', () => {
      const fn = () => ('generated string');
      expect(getUrlTemplate(fn)).toEqual('generated string');
    });

    it('passes getState to url function', () => {
      const fn = (getState) => (getState());
      const mockGetState = jest.fn();
      getUrlTemplate(fn, mockGetState);
      expect(mockGetState).toHaveBeenCalled();
    });
  });

  describe('parseReqDesc', () => {
    let results, consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(global.console, 'warn').mockImplementation();
    });

    it('returns object', () => {
      results = parseReqDesc({});
      expect(results).toBeInstanceOf(Object);
    });

    it('normalizes method name lowercase', () => {
      results = parseReqDesc({
        method: 'Post'
      });

      expect(results).toHaveProperty('method', 'post');
    });

    it('normalizes method as get if missing', () => {
      results = parseReqDesc({});

      expect(results).toHaveProperty('method', 'get');
    });

    it('issues deprecation warning if withCredentials sets', () => {
      results = parseReqDesc({});
      expect(consoleSpy).toHaveBeenCalledTimes(0);

      results = parseReqDesc({
        withCredentials: true
      });
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('deprecated'));
    });

    it('moves top level withCredentials to options if an object', () => {
      results = parseReqDesc({
        withCredentials: true,
        options: {
          bogus: true
        }
      });
      expect(results).toHaveProperty('options', {
        withCredentials: true,
        bogus: true
      });
    });

    it('moves top level withCredentials to options if not set', () => {
      results = parseReqDesc({
        withCredentials: true
      });
      expect(results).toHaveProperty('options', {
        withCredentials: true
      });
    });

    it('does not moves top level withCredentials to options if a function', () => {
      results = parseReqDesc({
        withCredentials: true,
        options: f => f
      });
      expect(results.options).toEqual(expect.any(Function));
      expect(results.options).not.toHaveProperty('withCredentials');
    });
  });

  describe('parseApiDesc', () => {
    let results;

    it('passes entries through parseReqDesc', () => {
      jest.spyOn(utils, 'parseReqDesc');
      results = parseApiDesc({
        test: {},
        test2: {
          method: 'Post'
        }
      });

      expect(results).toHaveProperty('test', expect.objectContaining({
        method: 'get'
      }));

      expect(results).toHaveProperty('test2', expect.objectContaining({
        method: 'post'
      }));
    });
  });

  describe('startsWith', () => {

    it('returns true if search string is at start', () => {
      expect(startsWith('example', 'ex')).toBe(true);
    });

    it('returns false if search string is not at start', () => {
      expect(startsWith('example', 'no')).toBe(false);
    });

    it('returns false if search string is not at start, even if present', () => {
      expect(startsWith('example', 'amp')).toBe(false);
    });
  });

  describe('endsWith', () => {

    it('returns true is search string is at end', () => {
      expect(endsWith('example', 'le')).toBe(true);
    });

    it('handles a string with multiple occurences', () => {
      expect(endsWith('siryessir', '')).toBe(true);
    });

    it('handles an empty search string', () => {
      expect(endsWith('example', '')).toBe(true);
    });

    it('returns false if search string is not at end', () => {
      expect(endsWith('example', 'no')).toBe(false);
    });

    it('returns false if search string is not at end, even if present', () => {
      expect(endsWith('example', 'amp')).toBe(false);
    });

    it('handles an empty string', () => {
      expect(endsWith('', 'amp')).toBe(false);
    });
  });

});

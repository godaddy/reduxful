import {
  transformUrl,
  buildQueryStr,
  getResourceKey,
  isLoaded,
  isUpdating,
  hasError,
  isFunction,
  getUrlTemplate,
  parseReqDesc,
  parseApiDesc
} from '../src/utils';
import * as utils from '../src/utils';
import { MissingParamError } from '../src/errors';

const params = {
  id: 'user123',
  count: 777
};

describe('Utils', () => {

  describe('transformUrl', () => {

    it('returns an unmodified url', () => {
      const url = 'http://site.com/api/items';
      expect(transformUrl(url)).toEqual(url);
    });

    it('returns a modified url with url params', () => {
      const url = 'http://site.com/api/items/:id/:count';
      expect(transformUrl(url, params)).toEqual('http://site.com/api/items/user123/777');
    });

    it('returns a modified url with query params', () => {
      const url = 'http://site.com/api/items/:id';
      expect(transformUrl(url, params)).toEqual('http://site.com/api/items/user123?count=777');
    });

    it('allows predefined query params in base url', () => {
      const url = 'http://site.com/api/items/:id?force=true';
      expect(transformUrl(url, params)).toEqual('http://site.com/api/items/user123?force=true&count=777');
    });

    it('throws an error with unmet param', () => {
      const url = 'http://site.com/api/items/:someMissingParam';
      expect(() => transformUrl(url, params)).toThrow(MissingParamError);
    });

    it('allows for port number in url', () => {
      const url = 'http://site.com:8080/api/items/:id';
      expect(transformUrl(url, params)).toEqual('http://site.com:8080/api/items/user123?count=777');
    });

    it('returns a url with hostname substituted', () => {
      const url = 'http://hostname.com:8080/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
      const expectedUrl = 'http://test.com:8080/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
      const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', apiHostname: 'test.com' };

      expect(transformUrl(url, params1)).toEqual(expectedUrl);
    });

    it('returns a url with port substituted', () => {
      const url = 'http://hostname.com:8080/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
      const expectedUrl = 'http://hostname.com:8443/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
      const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', apiPort: '8443' };

      expect(transformUrl(url, params1)).toEqual(expectedUrl);
    });

    it('returns a url with protocol substituted', () => {
      const url = 'http://hostname.com:8080/api/vms/:vmId/actions/:actionId?q1=:q1&q2=:q2&q3=q3';
      const expectedUrl = 'https://hostname.com:8080/api/vms/foo/actions/bar?q1=hello&q2=world&q3=q3';
      const params1 = { vmId: 'foo', actionId: 'bar', q1: 'hello', q2: 'world', apiProtocol: 'https' };

      expect(transformUrl(url, params1)).toEqual(expectedUrl);
    });

    it('returns a relative url with variables substitued', () => {
      const url = '/api/items/:id/:count';
      expect(transformUrl(url, params)).toEqual('/api/items/user123/777');
    });
  });

  describe('buildQueryStr', () => {

    it('supports single valued query params', () => {
      const queryParams = { param1: 'value1', param2: 'value2' };
      expect(buildQueryStr(queryParams)).toEqual('param1=value1&param2=value2');
    });

    it('supports multi valued query params', () => {
      const queryParams = { param1: 'value1', param2: ['value2', 'value3'] };
      expect(buildQueryStr(queryParams)).toEqual('param1=value1&param2=value2&param2=value3');
    });

    it('empty query params', () => {
      const queryParams = {};
      expect(buildQueryStr(queryParams)).toEqual('');
    });
  });

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
});

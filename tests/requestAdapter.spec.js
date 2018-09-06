import { setRequestAdapter, getRequestAdapter, makeRequest } from '../src/requestAdapter';
import { RequestAdapterError } from '../src/errors';

const mockUrl = 'some/api/';

describe('Request Adapter', () => {

  let mockRequestAdapter, mockGlobalPromise;

  beforeAll(() => {
    mockGlobalPromise = new Promise(() => {}, () => {});
  });

  beforeEach(() => {
    mockRequestAdapter = jest.fn().mockReturnValue(mockGlobalPromise);
  });

  afterEach(() => {
    delete global.Reduxful.requestAdapter;
    mockRequestAdapter.mockReset();
  });

  describe('#setRequestAdapter', () => {

    it('sets the global request adapter', () => {
      expect(global.Reduxful.requestAdapter).toBeUndefined();
      setRequestAdapter(mockRequestAdapter);
      expect(global.Reduxful.requestAdapter).toBe(mockRequestAdapter);
    });

    it('throws exception if request adapter has already been set', () => {
      setRequestAdapter(mockRequestAdapter);
      expect(() => setRequestAdapter(mockRequestAdapter)).toThrow(RequestAdapterError);
    });
  });

  describe('#getRequestAdapter', () => {

    it('returns the request adapter', () => {
      expect(global.Reduxful.requestAdapter).toBeUndefined();
      setRequestAdapter(mockRequestAdapter);
      const result = getRequestAdapter();
      expect(result).toBe(mockRequestAdapter);
    });

    it('throws exception if request adapter has not been set', () => {
      expect(() => getRequestAdapter()).toThrow(RequestAdapterError);
    });
  });

  describe('#makeRequest', () => {

    it('calls requestAdapter', () => {
      setRequestAdapter(mockRequestAdapter);
      makeRequest('get', mockUrl, {});
      expect(mockRequestAdapter).toHaveBeenCalledTimes(1);
    });

    it('returns requestAdapter results', () => {
      setRequestAdapter(mockRequestAdapter);
      const result = makeRequest('get', mockUrl, {});
      expect(result).toBeInstanceOf(Promise);
    });

    it('uses global request adapter', () => {
      setRequestAdapter(mockRequestAdapter);
      const result = makeRequest('get', mockUrl, {});
      expect(result).toBeInstanceOf(Promise);
      expect(result).toBe(mockGlobalPromise);
      expect(mockRequestAdapter).toHaveBeenCalledTimes(1);
    });

    it('uses api overridden request adapter', () => {
      setRequestAdapter(mockRequestAdapter);
      const mockApiPromise = new Promise(() => {}, () => {});
      const mockApiRequestAdapter = jest.fn().mockReturnValue(mockApiPromise);
      const result = makeRequest('get', mockUrl, {}, { requestAdapter: mockApiRequestAdapter });
      expect(result).toBeInstanceOf(Promise);
      expect(result).toBe(mockApiPromise);
      expect(mockApiRequestAdapter).toHaveBeenCalledTimes(1);
    });

    it('normalizes url and method for adapter options', () => {
      setRequestAdapter(mockRequestAdapter);
      makeRequest('get', mockUrl, {});
      expect(mockRequestAdapter).toBeCalledWith(expect.objectContaining({ method: 'get' }));
      expect(mockRequestAdapter).toBeCalledWith(expect.objectContaining({ url: mockUrl }));
    });

    it('defaults options to empty object', () => {
      setRequestAdapter(mockRequestAdapter);
      makeRequest('get', mockUrl);
      expect(mockRequestAdapter).toBeCalled();
    });

    it('passes headers if part of options', () => {
      const headers = { BOGUS: 'true' };
      setRequestAdapter(mockRequestAdapter);
      makeRequest('get', mockUrl, { headers });
      expect(mockRequestAdapter).toBeCalledWith(expect.objectContaining({ headers }));
    });

    it('passes body if part of options', () => {
      const body = 'BOGUS BODY';
      setRequestAdapter(mockRequestAdapter);
      makeRequest('post', mockUrl, { body });
      expect(mockRequestAdapter).toBeCalledWith(expect.objectContaining({ body }));
    });

    it('passes withCredentials if part of options', () => {
      setRequestAdapter(mockRequestAdapter);
      makeRequest('get', mockUrl, { withCredentials: true });
      expect(mockRequestAdapter).toBeCalledWith(expect.objectContaining({ withCredentials: true }));
    });

    it('passes any custom options', () => {
      setRequestAdapter(mockRequestAdapter);
      makeRequest('get', mockUrl, { bogus: true });
      expect(mockRequestAdapter).toBeCalledWith(expect.objectContaining({ bogus: true }));
    });
  });
});

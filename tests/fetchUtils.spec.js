import { makeFetchAdapter, handlers, defaultHeaders } from '../src/fetchUtils';

const mockUrl = 'https://example.com/api';
const mockDefaultOptions = { bogusDefault: 'BOGUS DEFAULT' };
const mockOptions = { bogus: 'BOGUS' };
const mockFooHeaders = { Foo: 'foo' };
const mockFetch = jest.fn();
const mockJsonData = { bogus: 'JSON' };
const mockTextData = 'bogus text';

describe('fetchUtils', () => {
  let fetchAdapter;

  beforeAll(() => {
    jest.spyOn(handlers, 'decode');
  });

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue();
    fetchAdapter = makeFetchAdapter(mockFetch, mockDefaultOptions);
  });

  describe('makeFetchAdapter', () => {

    it('returns a function', () => {
      const result = makeFetchAdapter(mockFetch);
      expect(result).toBeInstanceOf(Function);
    });
    it('accepts options as an object', () => {
      const result = makeFetchAdapter(mockFetch, {});
      expect(result).toBeInstanceOf(Function);
    });
  });

  describe('fetchAdapter', () => {

    beforeAll(() => {
      handlers.decode.mockImplementation().mockResolvedValue('bogus text');
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('calls wrapped function', () => {
      fetchAdapter({ url: mockUrl });
      expect(mockFetch).toHaveBeenCalled();
    });

    it('calls wrapped function with url from options as first arg', () => {
      fetchAdapter({ url: mockUrl });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, expect.any(Object));
    });

    it('calls wrapped function with options', () => {
      fetchAdapter({ url: mockUrl, ...mockOptions });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, expect.objectContaining(mockOptions));
    });

    it('calls wrapped function with no default headers', () => {
      fetchAdapter({ url: mockUrl, ...mockOptions });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, expect.not.objectContaining({ headers: expect.any(Object) }));
    });

    it('calls wrapped function with default options', () => {
      fetchAdapter({ url: mockUrl, ...mockOptions });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, expect.objectContaining(mockDefaultOptions));
    });

    it('overrides default options with request options', () => {
      fetchAdapter({ url: mockUrl, ...mockOptions, bogusDefault: 'New Bogus' });
      expect(mockFetch).not.toHaveBeenCalledWith(mockUrl, expect.objectContaining(mockDefaultOptions));
      expect(mockFetch.mock.calls[0][1]).toHaveProperty('bogusDefault', 'New Bogus');
    });

    it('appends option headers to defaults', () => {
      fetchAdapter({ url: mockUrl, ...mockOptions, headers: mockFooHeaders });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl,
        expect.objectContaining({ headers: { ...defaultHeaders, ...mockFooHeaders } }));
    });

    it('defaults credentials to same-origin', () => {
      fetchAdapter({ url: mockUrl });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl,
        expect.objectContaining({ credentials: 'same-origin' }));
    });

    it('sets credentials to include if withCredentials=true', () => {
      fetchAdapter({ url: mockUrl, withCredentials: true, credentials: 'bogus' });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl,
        expect.objectContaining({ credentials: 'include' }));
    });

    it('sets credentials to options if withCredentials=false', () => {
      fetchAdapter({ url: mockUrl, withCredentials: false, credentials: 'bogus' });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl,
        expect.objectContaining({ credentials: 'bogus' }));
    });
  });

  describe('Decode Handler', () => {
    let mockResponse;

    beforeEach(() => {
      mockResponse = {
        ok: true,
        headers: new Map(),
        json: jest.fn(),
        text: jest.fn(),
        clone: jest.fn()
      };
      mockResponse.json.mockResolvedValue(mockJsonData);
      mockResponse.text.mockResolvedValue(mockTextData);
      mockResponse.clone.mockImplementation(() => mockResponse);
    });

    it('decodes and resolves JSON content', async () => {
      mockResponse.headers.set('content-type', 'application/json');
      const data = await handlers.decode(mockResponse);
      expect(data).toBe(mockJsonData);
    });

    it('decodes and resolves TEXT content', async () => {
      mockResponse.headers.set('content-type', 'text/html');
      const data = await handlers.decode(mockResponse);
      expect(data).toBe(mockTextData);
    });

    it('decodes and resolves PLAIN TEXT content', async () => {
      mockResponse.headers.set('content-type', 'text/plain');
      const data = await handlers.decode(mockResponse);
      expect(data).toBe(mockTextData);
    });

    it('decodes and resolves no content on a 204 response', async () => {
      mockResponse.status = 204;
      const data = await handlers.decode(mockResponse);
      expect(data).toBe(null);
    });

    it('rejects for unhandled content types', async () => {
      mockResponse.text = jest.fn().mockImplementation(() => {
        throw new Error('`text` not implemented');
      });
      mockResponse.headers.set('content-type', 'some/type');
      const result = handlers.decode(mockResponse);
      await expect(result).rejects.toEqual(expect.objectContaining(
        { message: 'Content-type some/type not supported' }
      ));
    });

    it('decodes and resolves JSON content with null response', async () => {
      mockResponse.headers.set('content-type', 'application/json');
      mockResponse.json.mockResolvedValue(Promise.reject(new Error()));
      mockResponse.text.mockResolvedValue(Promise.resolve(null));

      const data = await handlers.decode(mockResponse);
      expect(data).toBe(null);
    });

    it('decodes and resolves JSON content with empty string response', async () => {
      mockResponse.headers.set('content-type', 'application/json');
      mockResponse.json.mockResolvedValue(Promise.reject(new Error()));
      mockResponse.text.mockResolvedValue(Promise.resolve(''));

      const data = await handlers.decode(mockResponse);
      expect(data).toBe(null);
    });

    it('decodes and resolves JSON throws invalid error', async () => {
      mockResponse.headers.set('content-type', 'application/json');
      mockResponse.json.mockResolvedValue(Promise.reject(new Error('bad json format')));
      mockResponse.text.mockResolvedValue(Promise.resolve('NOT JSON'));

      const result = handlers.decode(mockResponse);
      await expect(result).rejects.toEqual(expect.objectContaining(
        { message: 'bad json format' }
      ));
    });
  });

  describe('Finish Handler', () => {

    it('resolves if response ok', async () => {
      const result = handlers.finish({ ok: true }, mockTextData);
      await expect(result).resolves.toBe(mockTextData);
    });

    it('rejects if response not ok', async () => {
      const result = handlers.finish({ ok: false }, mockTextData);
      await expect(result).rejects.toBe(mockTextData);
    });
  });
});

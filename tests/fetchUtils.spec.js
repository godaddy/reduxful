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
        expect.objectContaining({ headers: { ...defaultHeaders, ...mockFooHeaders }}));
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
        text: jest.fn()
      };
      mockResponse.json.mockResolvedValue(mockJsonData);
      mockResponse.text.mockResolvedValue(mockTextData);
    });

    it('decodes and resolves JSON content', (done) => {
      mockResponse.headers.set('content-type', 'application/json');
      handlers.decode(mockResponse).then(data => {
        expect(data).toBe(mockJsonData);
        done();
      });
    });

    it('decodes and resolves TEXT content', (done) => {
      mockResponse.headers.set('content-type', 'text/html');
      handlers.decode(mockResponse).then(data => {
        expect(data).toBe(mockTextData);
        done();
      });
    });

    it('decodes and resolves PLAIN TEXT content', (done) => {
      mockResponse.headers.set('content-type', 'text/plain');
      handlers.decode(mockResponse).then(data => {
        expect(data).toBe(mockTextData);
        done();
      });
    });

    it('rejects for unhandled content types', (done) => {
      mockResponse.text = jest.fn().mockImplementation(() => {
        throw new Error('`text` not implemented');
      });
      mockResponse.headers.set('content-type', 'some/type');
      handlers.decode(mockResponse).catch(data => {
        expect(data).toContain('not supported');
        done();
      });
    });
  });

  describe('Finish Handler', () => {

    it('resolves if response ok', () => {
      const result = handlers.finish({ ok: true }, mockTextData);
      expect(result).resolves.toBe(mockTextData);
    });

    it('rejects if response not ok', () => {
      const result = handlers.finish({ ok: false }, mockTextData);
      expect(result).rejects.toBe(mockTextData);
    });
  });
});

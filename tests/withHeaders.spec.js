import { withHeaders } from '../src/withHeaders';

const mockUrl = 'https://example.com/api';
const mockFooHeaders = { Foo: 'foo' };
const mockBarHeaders = { Bar: 'bar' };
const mockFetch = jest.fn();

describe('withHeaders', () => {

  afterEach(() => {
    mockFetch.mockReset();
  });

  it('should return a function', () => {
    const result = withHeaders(mockFetch, {});
    expect(result).toBeInstanceOf(Function);
  });
  it('should accepts headers as an object', () => {
    const result = withHeaders(mockFetch, {});
    expect(result).toBeInstanceOf(Function);
  });
  it('should accepts headers as an function', () => {
    const mockHeaderFn = jest.fn().mockReturnValue(mockFooHeaders);
    const result = withHeaders(mockFetch, mockHeaderFn);
    expect(result).toBeInstanceOf(Function);
  });
  it('should execute headers as function when wrapper executed', () => {
    const mockHeaderFn = jest.fn().mockReturnValue(mockFooHeaders);
    const wrapper = withHeaders(mockFetch, mockHeaderFn);
    wrapper({ headers: mockBarHeaders });
    expect(mockHeaderFn).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith({ headers: { ...mockFooHeaders, ...mockBarHeaders }});
  });
  describe('fetch-like', () => {
    it('should execute wrapper with decorated headers', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      wrapper(mockUrl);
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, { headers: { ...mockFooHeaders }});
    });
    it('should execute wrapper with passed headers', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      wrapper(mockUrl, { headers: mockBarHeaders });
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, { headers: { ...mockFooHeaders, ...mockBarHeaders }});
    });
    it('passed headers should override decorated', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      wrapper(mockUrl, { headers: { Foo: 'New Foo' }});
      expect(mockFetch).toHaveBeenCalledWith(mockUrl, { headers: { Foo: 'New Foo' }});
    });
  });
  describe('request-like', () => {
    it('should execute wrapper with decorated headers', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      wrapper({ url: mockUrl });
      expect(mockFetch).toHaveBeenCalledWith({ url: mockUrl, headers: { ...mockFooHeaders }});
    });
    it('should execute wrapper with passed headers', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      wrapper({ url: mockUrl, headers: mockBarHeaders });
      expect(mockFetch).toHaveBeenCalledWith({ url: mockUrl, headers: { ...mockFooHeaders, ...mockBarHeaders }});
    });
    it('passed headers should override decorated', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      wrapper({ url: mockUrl, headers: { Foo: 'New Foo' }});
      expect(mockFetch).toHaveBeenCalledWith({ url: mockUrl, headers: { Foo: 'New Foo' }});
    });
  });
  describe('unexpected call', () => {
    it('should throw if unexpected arguments', () => {
      const wrapper = withHeaders(mockFetch, mockFooHeaders);
      expect(() => wrapper(123, false)).toThrow(/Unexpected arguments/);
    });
  });
});

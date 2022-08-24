import PromiseKeeper from '../src/promiseKeeper';

const mockKey = 'mockKeyName';

describe('PromiseKeeper', () => {
  let promise, doResolve, doReject, _promiseKeeper;

  beforeEach(() => {
    _promiseKeeper = new PromiseKeeper();

    promise = new Promise((resolve, reject) => {
      doResolve = () => resolve();
      doReject = () => reject(new Error('bogus'));
    });
  });

  it('creates new instance of class', () => {
    const instance = new PromiseKeeper();
    expect(instance).toBeInstanceOf(PromiseKeeper);
  });

  it('sets new promises', () => {
    expect(_promiseKeeper.size).toBe(0);
    _promiseKeeper.set(mockKey, promise);
    expect(_promiseKeeper.size).toBe(1);
  });

  it('gets existing promises', () => {
    _promiseKeeper.set(mockKey, promise);
    const expected = _promiseKeeper.get(mockKey);
    expect(expected).toBe(promise);
  });

  it('gets undefined for missing promises', () => {
    const expected = _promiseKeeper.get(mockKey);
    expect(expected).toBeUndefined();
  });

  it('returns false for missing promises', () => {
    const expected = _promiseKeeper.has(mockKey);
    expect(expected).toBe(false);
  });

  it('returns true for stored promises', () => {
    _promiseKeeper.set(mockKey, promise);
    const expected = _promiseKeeper.has(mockKey);
    expect(expected).toBe(true);
  });

  it('deletes keys', () => {
    _promiseKeeper.set(mockKey, promise);
    let expected = _promiseKeeper.has(mockKey);
    expect(expected).toBe(true);
    _promiseKeeper.delete(mockKey);
    expected = _promiseKeeper.has(mockKey);
    expect(expected).toBe(false);
  });

  it('clears keys', () => {
    _promiseKeeper.set(mockKey, promise);
    let expected = _promiseKeeper.has(mockKey);
    expect(expected).toBe(true);
    _promiseKeeper.clear();
    expected = _promiseKeeper.has(mockKey);
    expect(expected).toBe(false);
  });

  it('resolved promises are removed from store', async () => {
    _promiseKeeper.set(mockKey, promise);
    expect(_promiseKeeper.has(mockKey)).toBe(true);
    await doResolve();
    expect(_promiseKeeper.has(mockKey)).toBe(false);
  });

  it('rejected promises are removed from store', async () => {
    _promiseKeeper.set(mockKey, promise);
    expect(_promiseKeeper.has(mockKey)).toBe(true);
    await doReject();
    expect(_promiseKeeper.has(mockKey)).toBe(false);
  });
});

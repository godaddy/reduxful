import Reduxful, { setupApi } from '../src/reduxful';
import { mockApiName, mockApiDesc } from './fixtures/mockApi';


function tests(setup) {
  let testApi;

  beforeEach(() => {
    testApi = setup();
  });

  it('creates instance', () => {
    expect(testApi).toBeInstanceOf(Reduxful);
  });

  it('creates named actionCreators', () => {
    expect(testApi.actionCreators).toHaveProperty('updateFruit');
    expect(Object.keys(testApi.actionCreators).length).toBeGreaterThanOrEqual(6);
  });

  it('exposes actions alias', () => {
    expect(testApi.actions).toHaveProperty('updateFruit');
    expect(Object.keys(testApi.actions).length).toBeGreaterThanOrEqual(6);
  });

  it('creates named selectors', () => {
    expect(testApi.selectors).toHaveProperty('updateFruit');
    expect(Object.keys(testApi.selectors).length).toBeGreaterThanOrEqual(6);
  });

  it('creates a reducer', () => {
    expect(testApi.reducers).toHaveProperty(mockApiName, expect.any(Function));
  });

  it('exposes reducers', () => {
    expect(testApi.reducers).toBeInstanceOf(Object);
    expect(testApi.reducers).toHaveProperty(mockApiName);
  });

  it('exposes reducerMap alias', () => {
    expect(testApi.reducerMap).toBeInstanceOf(Object);
    expect(testApi.reducerMap).toHaveProperty(mockApiName);
  });
}

describe('Reduxful', () => {
  tests(() => new Reduxful(mockApiName, mockApiDesc));
});

describe('setupApi', () => {
  tests(() => setupApi(mockApiName, mockApiDesc));
});

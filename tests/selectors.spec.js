import createSelectors from '../src/selectors';
import { mockApiName, mockApiDesc } from './fixtures/mockApi';

const mockState = {
  mockApi: {
    getFruit__1234: {
      value: 'BOGUS'
    }
  }
};

describe('Selectors', () => {
  describe('createSelectors', () => {

    it('creates a map of functions', () => {
      const selectors = createSelectors(mockApiName, mockApiDesc);
      expect(selectors).toBeInstanceOf(Object);
      expect(selectors).toHaveProperty('getFruit');
      expect(selectors.getFruit).toBeInstanceOf(Function);
    });

    it('adds selector for unique resource alias', () => {
      const selectors = createSelectors(mockApiName, mockApiDesc);
      expect(selectors).toHaveProperty('otherFruit');
      expect(selectors).toHaveProperty('someOtherFruit');
    });
  });

  describe('selector', () => {
    let selectors, result;
    beforeAll(() => {
      selectors = createSelectors(mockApiName, mockApiDesc);
    });

    it('returns undefined if no api in state', () => {
      result = selectors.getFruit({}, { id: 1234 });
      expect(result).toBeUndefined();
    });

    it('returns undefined if no resource in api in state', () => {
      result = selectors.getFruit({ mockApi: {} }, { id: 1234 });
      expect(result).toBeUndefined();
    });

    it('returns resource for matching resource in state', () => {
      result = selectors.getFruit(mockState, { id: 1234 });
      expect(result).toBe(mockState.mockApi['getFruit__id:1234']);
    });

    it('returns undefined for mis-matched resource in state', () => {
      result = selectors.getFruit(mockState, { id: 5678 });
      expect(result).toBeUndefined();
    });

    it('returns proper aliased resource', () => {
      result = selectors.updateFruit(mockState, { id: 1234 });
      expect(result).toBe(mockState.mockApi['getFruit__id:1234']);
    });
  });
});

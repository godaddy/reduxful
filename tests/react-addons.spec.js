import { resourceShape, extendResourceShape } from '../src/addons/react-addons';

const PropTypes = require('prop-types');

const mockResource = {
  isLoaded: true,
  hasError: false,
  isUpdating: false
};

function checkPropTypes(propTypes, resource) {
  PropTypes.checkPropTypes(
    { bogus: propTypes },
    { bogus: resource },
    'prop',
    Math.random().toString());    // https://github.com/facebook/react/issues/7047#issuecomment-228614964
}

describe('React Addons', () => {
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockReset();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('resourceShape', () => {

    it('is a shape', () => {
      expect(resourceShape).toBeInstanceOf(Function);
      expect(resourceShape.name).toEqual(PropTypes.shape().name);
    });

    it('passes expected props', () => {
      checkPropTypes(resourceShape, { ...mockResource, isUpdating: true });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('errors failed props', () => {
      checkPropTypes(resourceShape, { ...mockResource, isUpdating: 'wrong' });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed prop type'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('expected `boolean`'));
    });
  });

  describe('extendResourceShape', () => {

    it('returns a shape', () => {
      const result = extendResourceShape({ value: PropTypes.string });
      expect(result).toBeInstanceOf(Function);
      expect(result.name).toEqual(resourceShape.name);
      expect(result.name).toEqual(PropTypes.shape().name);
    });

    it('passes valid default props', () => {
      const customShape = extendResourceShape();
      checkPropTypes(customShape, { ...mockResource, value: 'ABCD' });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('fails invalid default props', () => {
      const customShape = extendResourceShape();
      checkPropTypes(customShape, { ...mockResource, value: f => f });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `bogus.value`'));
    });

    it('passes valid overridden props', () => {
      const customShape = extendResourceShape({ value: PropTypes.string });
      checkPropTypes(customShape, { ...mockResource, value: 'ABCD' });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('fails invalid overridden props', () => {
      const customShape = extendResourceShape({ value: PropTypes.number });
      checkPropTypes(customShape, { ...mockResource, value: 'ABCD' });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `bogus.value`'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('expected `number`'));
    });

    it('only allows overriding `value` or `error` propTypes', () => {
      const customShape = extendResourceShape({ value: PropTypes.number, error: PropTypes.number, isUpdating: PropTypes.string });

      checkPropTypes(customShape, { ...mockResource, value: 'ABCD' });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `bogus.value`'));

      checkPropTypes(customShape, { ...mockResource, error: 'ABCD' });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `bogus.error`'));

      checkPropTypes(customShape, { ...mockResource, isUpdating: 'ABCD' });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `bogus.isUpdating`'));

      checkPropTypes(customShape, { ...mockResource, isUpdating: true });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    });
  });
});

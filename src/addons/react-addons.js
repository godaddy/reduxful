const PropTypes = require('prop-types');
const { array, number, bool, object, oneOfType, shape, node } = PropTypes;


const resourcePropTypes = {
  value: oneOfType([object, array, node]),
  error: oneOfType([object, array, node]),
  hasError: bool,
  isLoaded: bool.isRequired,
  isUpdating: bool.isRequired,
  requestTime: number,
  responseTime: number
};

/**
 * Use to extend the `resourceShape` to define `value` and/or `error` structures.
 *
 * @param {object} propTypes - PropTypes to override resource shapes
 * @param {object} [propTypes.value] - Shape of expected value
 * @param {object} [propTypes.error] - Shape of expected error
 * @returns {shape} shape
 */
function extendResourceShape(propTypes = {}) {
  return shape({
    ...resourcePropTypes,
    value: propTypes.value || resourcePropTypes.value,
    error: propTypes.error || resourcePropTypes.error
  });
}

/**
 * Base propTypes shape used for validation of resources in React components.
 *
 * @property {object|Array|string|*} value
 * @property {object|Array|string|*} error
 * @property {boolean} hasError
 * @property {boolean} isLoaded
 * @property {boolean} isUpdating
 * @property {number} requestTime
 * @property {number} responseTime
 */
const resourceShape = shape(resourcePropTypes);

module.exports = {
  resourceShape,
  extendResourceShape
};

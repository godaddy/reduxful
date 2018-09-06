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
 * @param {Object} propTypes - PropTypes to override resource shapes
 * @param {Object} [propTypes.value] - Shape of expected value
 * @param {Object} [propTypes.error] - Shape of expected error
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
 * @property {Object|Array|String|*} value
 * @property {Object|Array|String|*} error
 * @property {Boolean} hasError
 * @property {Boolean} isLoaded
 * @property {Boolean} isUpdating
 * @property {Number} requestTime
 * @property {Number} responseTime
 */
const resourceShape = shape(resourcePropTypes);

module.exports = {
  resourceShape,
  extendResourceShape
};

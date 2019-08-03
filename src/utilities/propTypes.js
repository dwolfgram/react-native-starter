import PropTypes from 'prop-types'

export const tag = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
])

export const numberish = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
])

export * from 'prop-types'

export default {
  ...PropTypes,
  tag,
  numberish
}

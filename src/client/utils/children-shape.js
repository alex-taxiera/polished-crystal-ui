import PropTypes from 'prop-types'

export const ChildrenShape = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.element),
  PropTypes.element,
  PropTypes.string,
  PropTypes.number,
])

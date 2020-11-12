import PropTypes from 'prop-types'

export const MoveShape = PropTypes.shape({
  level: PropTypes.number,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  power: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  accuracy: PropTypes.number.isRequired,
  pp: PropTypes.number.isRequired,
  effectChance: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
})

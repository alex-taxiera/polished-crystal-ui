import React from 'react'
import PropTypes from 'prop-types'

export function AnchorToTab ({ children, ...props }) {
  return (
    <a target="_blank" {...props}>
      {children}
    </a>
  )
}

AnchorToTab.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.string,
  ]),
}

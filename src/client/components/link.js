import React from 'react'

import { ChildrenShape } from '../utils/children-shape'

export function AnchorToTab ({ children, ...props }) {
  return (
    <a target="_blank" {...props}>
      {children}
    </a>
  )
}

AnchorToTab.propTypes = {
  children: ChildrenShape,
}

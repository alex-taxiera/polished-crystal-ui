import React from 'react'
import {
  NavLink as RouterLink,
} from 'react-router-dom'

import { ChildrenShape } from '../utils/children-shape'

export function NavLink ({ children, ...props }) {
  return (
    <RouterLink className="p-1 mx-2" {...props}>
      {children}
    </RouterLink>
  )
}

export function AnchorToTab ({ children, ...props }) {
  return (
    <a target="_blank" {...props}>
      {children}
    </a>
  )
}

NavLink.propTypes = AnchorToTab.propTypes = {
  children: ChildrenShape,
}

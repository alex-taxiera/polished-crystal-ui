import React from 'react'
import {
  Link as RouterLink,
} from 'react-router-dom'

import { ChildrenShape } from '../utils/children-shape'

export function BasicLink ({ children, ...props }) {
  return (
    <RouterLink {...props}>
      {children}
    </RouterLink>
  )
}

export function Link ({ children, ...props }) {
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

BasicLink.propTypes = Link.propTypes = AnchorToTab.propTypes = {
  children: ChildrenShape,
}
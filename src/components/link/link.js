import React from 'react'
import {
  Link as RouterLink,
} from 'react-router-dom'

import './link.scss'

export function BasicLink ({ children, ...props }) {
  return (
    <RouterLink className="basic-link" {...props}>
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

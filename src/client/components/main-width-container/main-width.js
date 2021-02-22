import React from 'react'

import {
  ChildrenShape,
} from '../../utils/children-shape'

import styles from './main-width.module.scss'

export function MainWidth ({ children }) {
  return <div className={styles['main-width']}>
    {children}
  </div>
}

MainWidth.propTypes = {
  children: ChildrenShape,
}

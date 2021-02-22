import React from 'react'
import cx from 'classnames'

import styles from './select.module.scss'

export function Select ({
  value,
  onChange,
  children,
  className,
  style,
}) {
  return (
    <div className={cx(styles.select, className)}>
      <select
        style={style}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
      <label></label>
    </div>
  )
}

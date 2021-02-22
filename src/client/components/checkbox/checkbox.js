import React from 'react'
import cx from 'classnames'

import Check from './check.svg'

import styles from './checkbox.module.scss'

export function Checkbox ({
  label,
  id,
  checked,
  disabled,
  onChange,
}) {
  return (
    <div className={styles.checkbox}>
      <label htmlFor={id}>
        {label}
      </label>
      &nbsp;
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <Check/>
    </div>
  )
}

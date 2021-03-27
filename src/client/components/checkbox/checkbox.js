import React from 'react'

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
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={id}>
        {label}
      </label>
      <Check/>
    </div>
  )
}

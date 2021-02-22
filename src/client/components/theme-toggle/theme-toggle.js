import React, {
  useState,
  useEffect,
} from 'react'

import SunIcon from './sun.svg'
import MoonIcon from './moon.svg'

import styles from './theme-toggle.module.scss'
import { useTheme } from '../../services/theme'

export function ThemeToggle () {
  const { theme, toggleTheme } = useTheme()

  console.log('theme :', theme)

  return (
    <div>
      <label
        className={styles['icon-label']}
        htmlFor="theme--toggle"
      >
        {theme === 'dark' ? <MoonIcon/> : <SunIcon/>}
      </label>
      <input
        id="theme--toggle"
        className='d-none'
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
    </div>
  )
}

import React from 'react'

import SunIcon from './sun.svg'
import MoonIcon from './moon.svg'

import styles from './theme-toggle.module.scss'
import { useTheme } from '../../services/theme'

export function ThemeToggle () {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className={styles['theme-toggle']} onClick={() => toggleTheme()}>
      {theme === 'dark' ? <MoonIcon/> : <SunIcon/>}
    </button>
  )
}

import React, {
  useState,
  useContext,
} from 'react'
import { getWindow } from '../utils/get-window'

const ThemeContext = React.createContext()

export function ThemeProvider ({ children, initial }) {
  const window = getWindow()

  const [ theme, _setTheme ] = useState(
    initial || window?.document.body.dataset.theme || 'light',
  )

  const resetTheme = () => {
    window.document.cookie =
      'theme=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setTheme('light')
  }

  const setCookie = (theme) => {
    window.document.cookie =
      'theme=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.document.cookie = `theme=${theme}; SameSite=Strict`
  }

  const updateDOM = (theme) => {
    window.document.body.dataset.theme = theme
  }

  const setTheme = (theme) => {
    updateDOM(theme)
    _setTheme(theme)
  }

  const toggleTheme = () => {
    const newTheme = (!theme || theme === 'light') ? 'dark' : 'light'
    setTheme(newTheme)
    setCookie(newTheme)
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      resetTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

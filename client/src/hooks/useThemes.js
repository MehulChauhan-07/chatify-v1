import { useState, useEffect } from 'react'
import { getStoredTheme, applyTheme } from '../utils/theme'
  
const useTheme = () => {
  const [theme, setThemeState] = useState(getStoredTheme())

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
  }

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return {
    theme,
    setTheme,
    isDark: theme === 'dark'
  }
}

export { useTheme };
export default useTheme;
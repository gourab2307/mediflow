
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const ThemeContext = createContext(null)

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem('mediflow-theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
  } catch {
    // Continue with the system preference if storage is unavailable.
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme

    try {
      localStorage.setItem('mediflow-theme', theme)
    } catch {
      // The theme still works for the current session.
    }
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light',
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}

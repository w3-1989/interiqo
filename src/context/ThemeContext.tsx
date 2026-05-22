import { createContext } from 'react'

interface ThemeContextType{
  isDarkMode: boolean,
  setIsDarkMode: (_: boolean) => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)



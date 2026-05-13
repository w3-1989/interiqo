import { createContext } from 'react'

export const ThemeContext = createContext({
  isDarkMode: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setIsDarkMode: (_: boolean) => {}
})



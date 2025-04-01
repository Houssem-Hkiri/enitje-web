import Cookies from 'js-cookie'

const THEME_COOKIE_NAME = 'theme-preference'

export const getThemePreference = (): 'dark' | 'light' => {
  // First check cookie
  const savedTheme = Cookies.get(THEME_COOKIE_NAME)
  if (savedTheme) {
    return savedTheme as 'dark' | 'light'
  }

  // If no cookie, check system preference
  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  }

  // Default to dark mode
  return 'dark'
}

export const setThemePreference = (theme: 'dark' | 'light') => {
  Cookies.set(THEME_COOKIE_NAME, theme, { expires: 365 }) // Cookie expires in 1 year
  document.documentElement.classList.toggle('dark', theme === 'dark')
} 
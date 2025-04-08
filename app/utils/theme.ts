import Cookies from 'js-cookie'

const THEME_COOKIE_NAME = 'theme-preference'

export type Theme = 'light' | 'dark';

/**
 * Gets the user's theme preference from localStorage or system preference
 */
export function getThemePreference(): Theme {
  if (typeof window === 'undefined') return 'dark';

  // Check cookies first (works better with SSR)
  const savedTheme = Cookies.get(THEME_COOKIE_NAME) as Theme | null;
  if (savedTheme) return savedTheme;
  
  // Check localStorage as fallback
  const localTheme = localStorage.getItem('theme') as Theme | null;
  if (localTheme) return localTheme;

  // Fall back to system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return systemPrefersDark ? 'dark' : 'light';
}

/**
 * Sets the theme preference in localStorage and applies it to the document
 */
export function setThemePreference(theme: Theme): void {
  if (typeof window === 'undefined') return;

  // Save to both cookies and localStorage for better compatibility
  Cookies.set(THEME_COOKIE_NAME, theme, { expires: 365 }); // Cookie expires in 1 year
  localStorage.setItem('theme', theme);

  // Apply theme to document element
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Toggles between light and dark themes
 */
export function toggleTheme(): Theme {
  const currentTheme = getThemePreference();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setThemePreference(newTheme);
  return newTheme;
}

export const getThemePreferenceFromCookie = (): 'dark' | 'light' => {
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

export const setThemePreferenceFromCookie = (theme: 'dark' | 'light') => {
  Cookies.set(THEME_COOKIE_NAME, theme, { expires: 365 }) // Cookie expires in 1 year
  document.documentElement.classList.toggle('dark', theme === 'dark')
} 
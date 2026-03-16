export type ThemeMode = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'themeMode'
const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

const isThemeMode = (value: string | null): value is ThemeMode => {
  return value === 'light' || value === 'dark' || value === 'system'
}

const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light'
  }
  return mode
}

export const getSavedThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'system'
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeMode(value) ? value : 'system'
}

export const saveThemeMode = (mode: ThemeMode) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, mode)
}

export const applyTheme = (mode: ThemeMode) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('data-theme', resolveTheme(mode))
}

export const getDarkModeMediaQuery = () => DARK_MODE_MEDIA_QUERY

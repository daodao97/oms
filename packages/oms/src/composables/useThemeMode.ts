import { computed, ref, watch } from 'vue'
import { useSettingsStore } from '../store'
import {
  applyDocumentTheme,
  dispatchThemeChange,
  getDocumentTheme,
  normalizeTheme,
  type ThemeMode
} from '@okiss/utils'

const THEME_STORAGE_KEY = 'oms-theme'

const themeMode = ref<ThemeMode>('light')
let initialized = false
let stopWatch: (() => void) | null = null

function detectInitialTheme(storeMode: unknown): ThemeMode {
  const fromStore = normalizeTheme((storeMode as string) ?? undefined)
  if (typeof window === 'undefined') {
    return fromStore
  }
  const cached = window.localStorage?.getItem(THEME_STORAGE_KEY)
  if (cached === 'dark' || cached === 'light') {
    return cached
  }
  if (storeMode === 'dark' || storeMode === 'light') {
    return storeMode
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function persistTheme(mode: ThemeMode) {
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem(THEME_STORAGE_KEY, mode)
  }
}

function applyTheme(mode: ThemeMode) {
  const normalized = normalizeTheme(mode)
  themeMode.value = normalized
  applyDocumentTheme(normalized)
  dispatchThemeChange(normalized)
  persistTheme(normalized)
}

export function useThemeMode() {
  const settingsStore = useSettingsStore()

  if (!initialized) {
    initialized = true
    const resolved = detectInitialTheme(settingsStore.themeMode)
    if (normalizeTheme(settingsStore.themeMode as string) !== resolved) {
      settingsStore.updateSettings({ themeMode: resolved } as any)
    } else {
      applyTheme(resolved)
    }
    stopWatch = watch(
      () => settingsStore.themeMode,
      (mode) => {
        applyTheme(normalizeTheme(mode as string))
      },
      { immediate: true }
    )
  }

  const mode = computed(() => themeMode.value)
  const isDark = computed(() => mode.value === 'dark')

  const setTheme = (next: ThemeMode) => {
    const normalized = normalizeTheme(next)
    if (settingsStore.themeMode !== normalized) {
      settingsStore.updateSettings({ themeMode: normalized } as any)
    } else {
      applyTheme(normalized)
    }
  }

  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return {
    themeMode: mode,
    isDark,
    setTheme,
    toggleTheme
  }
}

export function getThemeMode(): ThemeMode {
  if (!initialized) {
    return normalizeTheme(getDocumentTheme())
  }
  return themeMode.value
}

export function stopThemeWatcher() {
  stopWatch?.()
  stopWatch = null
  initialized = false
}

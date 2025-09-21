import type { Ref } from 'vue'

export type ThemeMode = 'light' | 'dark'

export const THEME_CHANGE_EVENT = 'oms-theme-change'

export function normalizeTheme(mode?: string | null): ThemeMode {
  return mode === 'dark' ? 'dark' : 'light'
}

export function getDocumentTheme(): ThemeMode {
  if (typeof document === 'undefined') {
    return 'light'
  }
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark' || attr === 'light') {
    return attr
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function applyDocumentTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') {
    return
  }
  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.setAttribute('data-theme', mode)
  root.style.setProperty('color-scheme', mode)
}

export function dispatchThemeChange(mode: ThemeMode) {
  if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') {
    return
  }
  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_CHANGE_EVENT, { detail: mode }))
}

export function onThemeChange(callback: (mode: ThemeMode) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ThemeMode>).detail
    callback(detail ?? getDocumentTheme())
  }
  window.addEventListener(THEME_CHANGE_EVENT, handler as EventListener)
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handler as EventListener)
}

export function bindThemeToRef(target: Ref<ThemeMode>) {
  if (typeof window === 'undefined') {
    return () => {}
  }
  const update = () => {
    target.value = getDocumentTheme()
  }
  const teardown = onThemeChange(mode => {
    target.value = normalizeTheme(mode)
  })
  let observer: MutationObserver | null = null
  if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    observer = new MutationObserver(() => {
      update()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
  }
  update()
  return () => {
    teardown()
    observer?.disconnect()
  }
}

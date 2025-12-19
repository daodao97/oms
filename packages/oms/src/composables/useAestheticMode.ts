import { computed, ref, watch } from 'vue'
import { useSettingsStore } from '../store'

export type AestheticMode = 'default' | 'theme1' | 'theme2' | 'theme3'
const AESTHETIC_STORAGE_KEY = 'oms-aesthetic-mode'

const aestheticMode = ref<AestheticMode>('theme1')
let initialized = false

function detectInitialAesthetic(storeMode: unknown): 'default' | 'theme1' | 'theme2' | 'theme3' {
    // Priority 1: Explicit Developer Configuration (from store/OmsOptions)
    if (storeMode === 'default' || storeMode === 'theme1' || storeMode === 'theme2' || storeMode === 'theme3') {
        return storeMode as any
    }

    if (typeof window === 'undefined') {
        return 'theme1'
    }

    // Priority 2: User Preference from LocalStorage (Fallback)
    const cached = window.localStorage?.getItem(AESTHETIC_STORAGE_KEY)
    if (cached === 'default' || cached === 'theme1' || cached === 'theme2' || cached === 'theme3') {
        return cached as any
    }

    return 'theme1'
}

function persistAesthetic(mode: 'default' | 'theme1' | 'theme2' | 'theme3') {
    if (typeof window !== 'undefined') {
        window.localStorage?.setItem(AESTHETIC_STORAGE_KEY, mode)
    }
}

function applyAesthetic(mode: 'default' | 'theme1' | 'theme2' | 'theme3') {
    aestheticMode.value = mode
    if (typeof document !== 'undefined') {
        const html = document.documentElement
        // Remove all theme classes first
        html.classList.remove('aesthetic-default', 'aesthetic-theme2', 'aesthetic-theme3')

        if (mode === 'default') {
            html.classList.add('aesthetic-default')
        } else if (mode === 'theme2') {
            html.classList.add('aesthetic-theme2')
        } else if (mode === 'theme3') {
            html.classList.add('aesthetic-theme3')
        }
        // theme1 is the base, no class needed
    }
    persistAesthetic(mode)
}

export function useAestheticMode() {
    const settingsStore = useSettingsStore()

    const setAestheticMode = (next: 'default' | 'theme1' | 'theme2' | 'theme3') => {
        if (settingsStore.aestheticMode !== next) {
            settingsStore.updateSettings({ aestheticMode: next } as any)
        } else {
            applyAesthetic(next)
        }
    }

    if (!initialized) {
        initialized = true
        const resolved = detectInitialAesthetic(settingsStore.aestheticMode)
        applyAesthetic(resolved)

        watch(
            () => settingsStore.aestheticMode,
            (mode) => {
                if (mode === 'default' || mode === 'theme1' || mode === 'theme2' || mode === 'theme3') {
                    applyAesthetic(mode)
                }
            },
            { immediate: true }
        )
    }

    return {
        aestheticMode: computed(() => aestheticMode.value),
        isTheme1: computed(() => aestheticMode.value === 'theme1'),
        setAestheticMode,
        toggleAestheticMode: () => {
            // Cycle through all themes for verification
            const modes: ('default' | 'theme1' | 'theme2' | 'theme3')[] = ['default', 'theme1', 'theme2', 'theme3']
            const currentIndex = modes.indexOf(aestheticMode.value)
            const nextIndex = (currentIndex + 1) % modes.length
            setAestheticMode(modes[nextIndex])
        }
    }
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_API: string
    readonly VITE_BASE: string
    readonly PROD: boolean
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
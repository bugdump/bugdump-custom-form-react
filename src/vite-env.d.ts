/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUGDUMP_API_KEY?: string;
  readonly VITE_BUGDUMP_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

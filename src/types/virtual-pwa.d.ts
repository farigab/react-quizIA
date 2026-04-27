// Type declarations for the Vite PWA virtual module
declare module 'virtual:pwa-register' {
  export function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: (update?: () => void) => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration?: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error?: unknown) => void;
  }): (() => Promise<void>) | undefined;
  export default registerSW;
}

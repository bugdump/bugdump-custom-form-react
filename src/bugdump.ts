import { Bugdump } from '@bugdump/sdk';

export const apiKey = import.meta.env.VITE_BUGDUMP_API_KEY ?? '';

// Initialized on import, before the app renders, so console and network capture
// covers the whole session. hideButton keeps the widget's floating button off the
// page: this app brings its own form.
export const bugdump = Bugdump.init({
  apiKey,
  endpoint: import.meta.env.VITE_BUGDUMP_ENDPOINT || undefined,
  hideButton: true,
});

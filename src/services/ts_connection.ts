
let closeFn: (() => void) | null = null;
let foregroundFn: (() => void) | null = null;

export function registerCloseHandler(fn: () => void) {
  closeFn = fn;
}

export function closeTSConnection() {
  if (closeFn) closeFn();
}

export function registerForegroundHandler(fn: () => void) {
  foregroundFn = fn;
}

export function handleAppForeground() {
  foregroundFn?.();
}
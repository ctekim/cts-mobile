// src/services/ts_connection.ts
let closeFn: (() => void) | null = null;

export function registerCloseHandler(fn: () => void) {
  closeFn = fn;
}

export function closeTSConnection() {
  if (closeFn) closeFn();
}
// src/common/events.ts
type Listener = (action: string, tableName: string, data: any) => void;

const listeners = new Set<Listener>();

export function DispatchTableEvent(action: string, tableName: string, data: any) {
  listeners.forEach((l) => l(action, tableName, data));
}

export function RegisterTableEvent(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
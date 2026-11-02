let listener: ((info: { code: number; reason: string }) => void) | null = null;

export function onConnectionLost(cb: (info: { code: number; reason: string }) => void) {
  listener = cb;
  return () => { listener = null; };
}

export function reportConnectionLost(code: number, reason: string) {
  listener?.({ code, reason });
}
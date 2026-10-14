
let ws: WebSocket | null = null;
let heartbeat: ReturnType<typeof setInterval> | null = null;
let lastServerMessageAt = 0;

export function setWs(socket: WebSocket | null) {
  ws = socket;
  lastServerMessageAt = 0;
}

export function getWs(): WebSocket | null {
  return ws;
}

export function markServerMessageReceived() {
  lastServerMessageAt = Date.now();
}

export function isSocketStale(maxSilenceMs: number): boolean {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    return true;
  }

  if (lastServerMessageAt === 0) {
    return false;
  }

  return Date.now() - lastServerMessageAt > maxSilenceMs;
}

export function setHeartbeat(h: ReturnType<typeof setInterval>) {
  heartbeat = h;
}

export function clearHeartbeat() {
  if (heartbeat) {
    clearInterval(heartbeat);
    heartbeat = null;
  }
}

export function closeSocket() {
  clearHeartbeat();

  if (ws) {
    const old = ws;
    ws = null;

    if (
      old.readyState === WebSocket.OPEN ||
      old.readyState === WebSocket.CONNECTING
    ) {
      old.close();
    }
  }

  lastServerMessageAt = 0;
}
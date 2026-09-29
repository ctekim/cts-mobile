// src/services/ws_state.ts

let ws: WebSocket | null = null;
let heartbeat: ReturnType<typeof setInterval> | null = null;

export function setWs(socket: WebSocket | null) {
  ws = socket;
}

export function getWs(): WebSocket | null {
  return ws;
}

export function setHeartbeat(h: ReturnType<typeof setInterval> | null) {
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
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  ws = null;
}
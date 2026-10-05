"use client";
import { useCallback, useEffect, useRef, useState } from "react";
export function useWebSocket<T>(url: string) {
  const socket = useRef<WebSocket | null>(null); const reconnect = useRef(0); const [connected, setConnected] = useState(false); const [message, setMessage] = useState<T>();
  useEffect(() => { let disposed = false; let timer: ReturnType<typeof setTimeout> | undefined;
    const connect = () => { if (disposed) return; const current = new WebSocket(url); socket.current = current; current.onopen = () => { reconnect.current = 0; setConnected(true); }; current.onmessage = (event) => { try { setMessage(JSON.parse(event.data) as T); } catch { /* Ignore malformed server frames. */ } }; current.onclose = () => { setConnected(false); const delay = Math.min(30_000, 500 * 2 ** reconnect.current++); timer = setTimeout(connect, delay); }; };
    connect(); return () => { disposed = true; if (timer) clearTimeout(timer); socket.current?.close(); };
  }, [url]);
  const send = useCallback((payload: T) => { if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(JSON.stringify(payload)); }, []);
  return { connected, message, send };
}

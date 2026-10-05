"use client";
import { useEffect, useRef, useState } from "react";
export function useMatrixSync<T>(url: string, roomId: string) {
  const socket = useRef<WebSocket | null>(null); const [value, setValue] = useState<T>(); const [connected, setConnected] = useState(false);
  useEffect(() => { const connection = new WebSocket(`${url.replace(/\/$/, "")}/${encodeURIComponent(roomId)}`); socket.current = connection; connection.onopen = () => setConnected(true); connection.onclose = () => setConnected(false); connection.onmessage = (event) => { try { setValue(JSON.parse(event.data) as T); } catch { /* Ignore malformed peer messages. */ } }; return () => connection.close(); }, [roomId, url]);
  return { value, connected, send: (message: T) => { if (socket.current?.readyState === WebSocket.OPEN) socket.current.send(JSON.stringify(message)); } };
}

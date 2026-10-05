"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
export interface MatrixEvent { type: string; payload: unknown; }
interface MatrixValue { events: MatrixEvent[]; connected: boolean; apply: (event: MatrixEvent) => void; setConnected: (value: boolean) => void; }
const MatrixContext = createContext<MatrixValue | undefined>(undefined);
export function MatrixProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<MatrixEvent[]>([]); const [connected, setConnected] = useState(false);
  const value = useMemo(() => ({ events, connected, setConnected, apply: (event: MatrixEvent) => setEvents((current) => [...current.slice(-99), event]) }), [connected, events]);
  return <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>;
}
export function useMatrix(): MatrixValue { const value = useContext(MatrixContext); if (!value) throw new Error("useMatrix must be used inside MatrixProvider"); return value; }

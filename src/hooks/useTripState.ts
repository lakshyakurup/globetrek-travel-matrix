"use client";
import { useCallback, useState } from "react";
export function useTripState<T>(initial: T) {
  const [state, setState] = useState(initial); const update = useCallback((next: T | ((current: T) => T)) => setState(next), []);
  const optimistic = useCallback(async (next: T, persist: (value: T) => Promise<void>) => { const previous = state; setState(next); try { await persist(next); } catch (error) { setState(previous); throw error; } }, [state]);
  return { state, update, optimistic };
}

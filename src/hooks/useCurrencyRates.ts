"use client";
import { useEffect, useState } from "react";
export function useCurrencyRates(base: string, endpoint = "/api/rates") {
  const [rates, setRates] = useState<Record<string, number>>(); const [error, setError] = useState<Error>();
  useEffect(() => { const controller = new AbortController(); fetch(`${endpoint}?base=${encodeURIComponent(base)}`, { signal: controller.signal }).then((response) => { if (!response.ok) throw new Error(`Rates request failed: ${response.status}`); return response.json() as Promise<{ rates: Record<string, number> }>; }).then((data) => setRates(data.rates)).catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason : new Error("Rates unavailable")); }); return () => controller.abort(); }, [base, endpoint]);
  return { rates, error, loading: !rates && !error };
}
